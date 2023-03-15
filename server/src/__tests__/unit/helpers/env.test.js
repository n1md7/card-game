import { Env } from '../../../helpers/env';

describe('Env', () => {
  it('should be defined', () => {
    expect(new Env()).toBeDefined();
  });

  it('should return the correct environment', () => {
    expect(Env.NodeEnv).toEqual('test');
  });

  it('should test isDev', function () {
    expect(Env.isDev).toBe(false);
  });

  it('should test isProd', function () {
    expect(Env.isProd).toBe(false);
  });

  it('should test isTest', function () {
    expect(Env.isTest).toBe(true);
  });

  it('should throw when no NODE_ENV defined', function () {
    process.env.NODE_ENV = '';
    expect(() => Env.NodeEnv).toThrowError('NODE_ENV is not defined');
  });
});
