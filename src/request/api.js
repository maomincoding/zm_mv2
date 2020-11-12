import { get } from './http'
export const list = (v1) => get(`https://www.maomin.club/muc/top/mv?offset=${v1}&limit=30`, v1);
export const mv = v2 => get(`https://www.maomin.club/muc/mv/url?id=${v2}`, v2)
export const pl = (v3, v4) => get(`https://www.maomin.club/muc/comment/mv?id=${v3}&limit=${v4}`, v3)
