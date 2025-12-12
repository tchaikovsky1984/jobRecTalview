import { Request, Response, NextFunction } from "express";
import { jest } from "@jest/globals";

export const createMockRequest = (overrides?: Partial<any>): Request => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides,
  } as unknown as Request;
};

export const createMockResponse = (overrides?: Partial<any>): Response => {
  const res = {} as Response;
  res.statusCode = 0;
  res.status = jest.fn((code: number) => { res.statusCode = code; return res; });
  res.json = jest.fn((obj: any) => { (res as any).message = obj.message; return res; });
  return res;
};

export const createMockNextFunction = (): NextFunction => {
  const funct = jest.fn();
  return funct as unknown as NextFunction;
}

