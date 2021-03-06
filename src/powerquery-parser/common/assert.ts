// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommonError } from ".";
import { Err, Ok, Result, ResultUtils } from "./result";

export function asDefined<T>(maybeValue: T | undefined, maybeMessage?: string, maybeDetails?: {}): NonNullable<T> {
    isDefined(maybeValue, maybeMessage, maybeDetails);
    return maybeValue;
}

export function isTrue(value: boolean, maybeMessage?: string, maybeDetails?: {}): asserts value is true {
    if (value !== true) {
        throw new CommonError.InvariantError(maybeMessage ?? `assert failed, expected value to be true`, maybeDetails);
    }
}

export function isFalse(value: boolean, maybeMessage?: string, maybeDetails?: {}): asserts value is false {
    if (value !== false) {
        throw new CommonError.InvariantError(maybeMessage ?? `assert failed, expected value to be false`, maybeDetails);
    }
}

export function isNever(_: never): never {
    throw new CommonError.InvariantError(`Should never be reached. Stack trace: ${new Error().stack}`);
}

export function isDefined<T>(
    maybeValue: T | undefined,
    maybeMessage?: string,
    maybeDetails?: {},
): asserts maybeValue is NonNullable<T> {
    if (maybeValue === undefined) {
        throw new CommonError.InvariantError(
            maybeMessage ?? `assert failed, expected value to be defined`,
            maybeDetails,
        );
    }
}

export function isUndefined<T>(
    maybeValue: T | undefined,
    maybeMessage?: string,
    maybeDetails?: {},
): asserts maybeValue is undefined {
    if (maybeValue !== undefined) {
        throw new CommonError.InvariantError(
            maybeMessage ?? `assert failed, expected value to be undefined`,
            maybeDetails,
        );
    }
}

export function isOk<T, E extends Error>(result: Result<T, E>): asserts result is Ok<T> {
    if (!ResultUtils.isOk(result)) {
        throw new CommonError.InvariantError(`assert failed, result expected to be an Ok`, {
            error: result.error.toString(),
        });
    }
}

export function isErr<T, E>(result: Result<T, E>): asserts result is Err<E> {
    if (!ResultUtils.isErr(result)) {
        throw new CommonError.InvariantError(`assert failed, result expected to be an Err`);
    }
}

export function shouldNeverBeReachedTypescript(): CommonError.InvariantError {
    return new CommonError.InvariantError(`this should never be reached but TypeScript can't tell that`);
}
