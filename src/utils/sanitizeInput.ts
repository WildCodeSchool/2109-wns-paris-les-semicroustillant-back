import sanitize from 'mongo-sanitize';
import { MiddlewareFn } from 'type-graphql';

const SanitizeInputMiddleware: MiddlewareFn = async ({ args }, next) => {
  sanitize(args);

  return next();
};

export default SanitizeInputMiddleware;
