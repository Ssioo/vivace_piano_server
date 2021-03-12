export interface Jwt {
  userId: string
}

export interface User {
  key: string
  name: string
  phone: string
  pwd: string
  birth: string
  univ: string
  department: string
  hakbun: number
  grade: number
  createdAt: string
  expiredAt?: string | null
  roles: Role[]
  generations: number[]
  group: GroupType
  memo?: string | null
}

export enum Role {
  COMMON = '부원',
  LEADER = '회장',
  SUB_LEADER = '부회장',
  EXECUTIVE = '임원',
  FINANCIAL = '총무',
}

export enum GroupType {
  VIVACE = '비바체',
  CANTABILE = '칸타빌레',
  NONE = '없음'
}

export interface Chulcheck {
  key: string
  userKey: string
  createdAt: string
  time: number
  latLng: LatLng
}

export interface LatLng {
  latitude: number
  longitude: number
}

export interface Academy {
  key: string
  name: string
  registeredAt: string
  latLng: LatLng
  expiredAt?: string
}
