/**
 * 関連するデータを持つ成功結果を表します。
 * @template D データの型。
 * @example
 * const successResult: SuccessResult<number> = { status: "SUCCESS", data: 42 };
 */
export type SuccessResult<D> = {
  status: "SUCCESS";
  data: D;
};

/**
 * SuccessResultオブジェクトを作成します。
 * @template D データの型。
 * @param {D} data 成功結果に含めるデータ。
 * @returns {SuccessResult<D>} SuccessResultオブジェクト。
 * @example
 * const result = Success(42);
 * // result: { status: "SUCCESS", data: 42 }
 */
export const Success = <D>(data: D): SuccessResult<D> => ({
  status: "SUCCESS",
  data,
});

/**
 * コードと理由を持つ失敗結果を表します。
 * @template C エラーコードの型（文字列である必要があります）。
 * @template R 理由の型（null、文字列、またはオブジェクトが可能）。
 * @example
 * const notFoundError: FailedResult<"NOT_FOUND", string> = {
 *   status: "FAILED",
 *   code: "NOT_FOUND",
 *   reason: "The requested resource was not found."
 * };
 *
 * const validationError: FailedResult<"VALIDATION_ERROR", { [key: string]: string }> = {
 *   status: "FAILED",
 *   code: "VALIDATION_ERROR",
 *   reason: { email: "Invalid email format", password: "Password too short" }
 * };
 */
export type FailedResult<C extends string, R> = {
  status: "FAILED";
  code: C;
  reason: R;
};

/**
 * まだ読み込み中の結果を表します。
 */
export type LoadingResult = {
  status: "LOADING";
};

export const LOADING: LoadingResult = { status: "LOADING" };

/**
 * FailedResultオブジェクトを作成します。
 * @template C エラーコードの型（文字列である必要があります）。
 * @template R 理由の型（null、文字列、またはオブジェクトが可能）。
 * @param {C} code エラーコード。
 * @param {R} reason 失敗の理由。
 * @returns {FailedResult<C, R>} FailedResultオブジェクト。
 * @example
 * const result = Failed("NOT_FOUND", "The requested resource was not found.");
 * // result: { status: "FAILED", code: "NOT_FOUND", reason: "The requested resource was not found." }
 */
export const Failed = <C extends string, R>(
  code: C,
  reason: R,
): FailedResult<C, R> => ({
  status: "FAILED",
  code,
  reason,
});

/**
 * 不明なエラーに対する事前定義されたFailedResult。
 */
export const FAILED_UNKNOWN = Failed("UNKNOWN", null);

/**
 * 見つからないエラーに対する事前定義されたFailedResult。
 */
export const FAILED_NOT_FOUND = Failed("NOT_FOUND", null);

/**
 * 切断エラーに対する事前定義されたFailedResult。
 */
export const FAILED_DISCONNECTED = Failed("DISCONNECTED", null);

/**
 * 不正なリクエストエラーに対する事前定義されたFailedResult。
 */
export const FAILED_BAD_REQUEST = Failed("BAD_REQUEST", null);

/**
 * 成功または失敗のいずれかの結果を表します。
 * @template D 成功の場合のデータの型。
 * @template F FailedResultの型（デフォルトはnever）。
 */
export type Result<D, F extends FailedResult<string, unknown> = never> =
  | SuccessResult<D>
  | typeof FAILED_UNKNOWN
  | F;

/**
 * 成功、失敗、または読み込み中のいずれかの結果を表します。
 * @template D 成功の場合のデータの型。
 * @template F FailedResultの型（デフォルトはnever）。
 */
export type ResultWithLoading<
  D,
  F extends FailedResult<string, unknown> = never,
> = Result<D, F> | LoadingResult;

/**
 * Result型からデータ型を抽出します。
 * @template T 抽出元のResult型。
 */
export type UnPackResult<
  T extends Result<unknown, FailedResult<string, unknown>>,
> = T extends SuccessResult<infer D> ? D : never;

/**
 * Result または Promise<Result> を返す関数の成功データ型を抽出する型ユーティリティです。
 *
 * @template T - Result<unknown> または Promise<Result<unknown>> を返す関数型。
 *
 * @description
 * この型ユーティリティは、関数の戻り値の型から成功データ型を抽出します。
 * Result を返す同期関数と非同期関数の両方に対応しています。
 *
 * 関数が Promise<Result<unknown>> を返す場合、Promise を解決した後に Result から成功データ型を抽出します。
 * 関数が直接 Result<unknown> を返す場合、Result から成功データ型を抽出します。
 *
 * @example
 * type AsyncFunc = () => Promise<Result<string>>;
 * type SyncFunc = () => Result<number>;
 *
 * type AsyncResult = UnPackFunctionResult<AsyncFunc>; // string
 * type SyncResult = UnPackFunctionResult<SyncFunc>;  // number
 */
export type UnPackFunctionResult<
  T extends (
    ...args: never[]
  ) =>
    | Result<unknown, FailedResult<string, unknown>>
    | Promise<Result<unknown, FailedResult<string, unknown>>>,
> =
  ReturnType<T> extends Promise<Result<unknown, FailedResult<string, unknown>>>
    ? UnPackResult<Awaited<ReturnType<T>>>
    : UnPackResult<ReturnType<T>>;
