export enum IMAGE_ERROR_TYPES {
    invalidFile = 1,
    exceedSize = 2,
    invalidResolution = 3,
    serverError = 4
}
export const IMAGE_DIMENSION = {
    width: 8000,
    height: 8000
}
export const IMAGE_SIZE = {
    limit_50MB: '50 MB',
    BYTES_50MB: 50,
}