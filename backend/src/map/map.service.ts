import { Injectable } from '@nestjs/common';
import { MapRepository } from '@src/map/map.repository';
import { User } from '@src/user/entity/user.entity';
import { MapListResponse } from '@src/map/dto/MapListResponse';
import { MapDetailResponse } from '@src/map/dto/MapDetailResponse';
import { UserRepository } from '@src/user/user.repository';
import { UpdateMapInfoRequest } from '@src/map/dto/UpdateMapInfoRequest';
import { CreateMapRequest } from '@src/map/dto/CreateMapRequest';
import { MapNotFoundException } from '@src/map/exception/MapNotFoundException';
import { DuplicatePlaceToMapException } from '@src/map/exception/DuplicatePlaceToMapException';
import { PlaceRepository } from '@src/place/place.repository';
import { InvalidPlaceToMapException } from '@src/map/exception/InvalidPlaceToMapException';
import { Map } from '@src/map/entity/map.entity';
import { Color } from '@src/place/place.color.enum';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class MapService {
  constructor(
    private readonly mapRepository: MapRepository,
    private readonly userRepository: UserRepository,
    private readonly placeRepository: PlaceRepository,
  ) {}

  // Todo. 작성자명 등 ... 검색 조건 추가
  // Todo. fix : public 으로 조회해서 페이지마다 수 일정하게. (현재는 한 페이지에 10개 미만인 경우 존재)
  async searchMap(query?: string, page: number = 1, pageSize: number = 10) {
    const maps = query
      ? await this.mapRepository.searchByTitleQuery(query, page, pageSize)
      : await this.mapRepository.findAll(page, pageSize);

    const totalCount = await this.mapRepository.count({
      where: { title: query, isPublic: true },
    });

    const publicMaps = maps.filter((map) => map.isPublic);

    return {
      maps: await Promise.all(publicMaps.map(MapListResponse.from)),
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    };
  }

  async getOwnMaps(userId: number, page: number = 1, pageSize: number = 10) {
    // Todo. 그룹 기능 추가
    const totalCount = await this.mapRepository.count({
      where: { user: { id: userId } },
    });

    const ownMaps = await this.mapRepository.findByUserId(
      userId,
      page,
      pageSize,
    );

    return {
      maps: await Promise.all(ownMaps.map(MapListResponse.from)),
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    };
  }

  async getMapById(id: number) {
    const map = await this.mapRepository.findById(id);
    if (!map) throw new MapNotFoundException(id);

    return await MapDetailResponse.from(map);
  }

  async createMap(userId: number, createMapForm: CreateMapRequest) {
    const user = { id: userId } as User;
    const map = createMapForm.toEntity(user);
    return { id: (await this.mapRepository.save(map)).id };
  }

  async deleteMap(id: number) {
    await this.checkExists(id);

    await this.mapRepository.softDelete(id);
    return { id };
  }

  async updateMapInfo(id: number, updateMapForm: UpdateMapInfoRequest) {
    await this.checkExists(id);

    const { title, description } = updateMapForm;
    return this.mapRepository.update(id, { title, description });
  }

  async updateMapVisibility(id: number, isPublic: boolean) {
    await this.checkExists(id);
    return this.mapRepository.update(id, { isPublic });
  }

  async addPlace(
    id: number,
    placeId: number,
    color = Color.RED,
    comment?: string,
  ) {
    const map = await this.mapRepository.findById(id);
    if (!map) throw new MapNotFoundException(id);
    await this.validatePlacesForMap(placeId, map);

    map.addPlace(placeId, color, comment);
    await this.mapRepository.save(map);

    return {
      comment,
      color,
      placeId: placeId,
    };
  }

  @Transactional()
  async updatePlace(
    id: number,
    placeId: number,
    color?: Color,
    comment?: string,
  ) {
    const map = await this.getMapOrElseThrowNotFound(id);
    map.updatePlace(placeId, color, comment);

    return this.mapRepository.save(map);
  }

  async deletePlace(id: number, placeId: number) {
    const map = await this.getMapOrElseThrowNotFound(id);

    map.deletePlace(placeId);
    await this.mapRepository.save(map);

    return { deletedId: placeId };
  }

  private async getMapOrElseThrowNotFound(id: number) {
    const map = await this.mapRepository.findById(id);
    if (!map) {
      throw new MapNotFoundException(id);
    }
    return map;
  }

  private async checkExists(id: number) {
    if (!(await this.mapRepository.existById(id))) {
      throw new MapNotFoundException(id);
    }
  }

  private async validatePlacesForMap(placeId: number, map: Map) {
    if (!(await this.placeRepository.existById(placeId))) {
      throw new InvalidPlaceToMapException(placeId);
    }

    if (map.hasPlace(placeId)) {
      throw new DuplicatePlaceToMapException(placeId);
    }
  }
}
