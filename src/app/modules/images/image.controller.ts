import catchAsync from '~shared/catchAsync'
import sendResponse from '~shared/sendResponse'
import { ReqWithUser } from '~types/common'
import httpStatus from '~utils/httpStatus'
import { filterQueries } from '~utils/paginationUtils'
import { imagesService } from './image.service'

const generateImage = catchAsync(async (req, res) => {
  const { body, user } = req as ReqWithUser
  const generatedImageData = await imagesService.generateImage(body, user)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Image created successfully!',
    data: generatedImageData
  })
})

const getUserImages = catchAsync(async (req, res) => {
  const { query, user } = req as ReqWithUser
  const params = filterQueries(query)
  const { userImages, meta } = await imagesService.getUserImages(params, user)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User images retrieved successfully!',
    data: userImages,
    meta
  })
})

const getImage = catchAsync(async (req, res) => {
  const {
    params: { id },
    user
  } = req as ReqWithUser
  const imageData = await imagesService.getImage(Number(id), user)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Image retrieved successfully!',
    data: imageData
  })
})

const updateImage = catchAsync(async (req, res) => {
  const {
    params: { id },
    body,
    user
  } = req as ReqWithUser
  const updatedImage = await imagesService.updateImage(Number(id), body, user)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Image updated successfully!',
    data: updatedImage
  })
})

const deleteImage = catchAsync(async (req, res) => {
  const {
    params: { id },
    user
  } = req as ReqWithUser
  await imagesService.deleteImage(Number(id), user)

  res.status(httpStatus.NO_CONTENT).send()
})

export const imageController = {
  generateImage,
  getUserImages,
  getImage,
  updateImage,
  deleteImage
}
