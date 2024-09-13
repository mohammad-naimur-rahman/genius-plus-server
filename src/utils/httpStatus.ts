const httpStatus = {
  /**
   * The request has succeeded.
   */
  OK: 200,

  /**
   * The request has been fulfilled and has resulted in one or more new resources being created.
   */
  CREATED: 201,

  /**
   * The request has been accepted for processing, but the processing has not been completed.
   */
  ACCEPTED: 202,

  /**
   * The server has successfully fulfilled the request and that there is no additional content to send in the response payload body.
   */
  NO_CONTENT: 204,

  /**
   * The target resource has been assigned a new permanent URI and any future references to this resource ought to use one of the returned URIs.
   */
  MOVED_PERMANENTLY: 301,

  /**
   * The target resource resides temporarily under a different URI.
   */
  FOUND: 302,

  /**
   * The target resource has not been modified since the last request.
   */
  NOT_MODIFIED: 304,

  /**
   * The server cannot or will not process the request due to something that is perceived to be a client error.
   */
  BAD_REQUEST: 400,

  /**
   * The request has not been applied because it lacks valid authentication credentials for the target resource.
   */
  UNAUTHORIZED: 401,

  /**
   * Reserved for future use.
   */
  PAYMENT_REQUIRED: 402,

  /**
   * The server understood the request but refuses to authorize it.
   */
  FORBIDDEN: 403,

  /**
   * The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.
   */
  NOT_FOUND: 404,

  /**
   * The method received in the request-line is known by the origin server but not supported by the target resource.
   */
  METHOD_NOT_ALLOWED: 405,

  /**
   * The request could not be completed due to a conflict with the current state of the target resource.
   */
  CONFLICT: 409,

  /**
   * Access to the target resource is no longer available at the origin server and that this condition is likely to be permanent.
   */
  GONE: 410,

  /**
   * The origin server is refusing to service the request because the payload is in a format not supported by this method on the target resource.
   */
  UNSUPPORTED_MEDIA_TYPE: 415,

  /**
   * The server encountered an unexpected condition that prevented it from fulfilling the request.
   */
  INTERNAL_SERVER_ERROR: 500,

  /**
   * The server does not support the functionality required to fulfill the request.
   */
  NOT_IMPLEMENTED: 501,

  /**
   * The server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request.
   */
  BAD_GATEWAY: 502,

  /**
   * The server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay.
   */
  SERVICE_UNAVAILABLE: 503,

  /**
   * The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server it needed to access in order to complete the request.
   */
  GATEWAY_TIMEOUT: 504
} as const

export default httpStatus
