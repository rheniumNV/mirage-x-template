import { res2yaml } from "../../../src/lib/mirage-x/util/res2yaml";
import BoxInput1 from "./__test__input/res2yamlInput1.json";
import BoxInput2 from "./__test__input/res2yamlInput2.json";
import BoxInput3 from "./__test__input/res2yamlInput3.json";
import BoxInput4 from "./__test__input/res2yamlInput4.json";

describe("IDが違うオブジェクトを変換しても同じ値になる", () => {
  test("Box", () => {
    const input1 = BoxInput1 as unknown as Parameters<typeof res2yaml>[0];
    const output1 = res2yaml(input1);

    const input2 = BoxInput2 as unknown as Parameters<typeof res2yaml>[0];
    const output2 = res2yaml(input2);

    expect(output1).toEqual(output2);
  });
});

//TODO: テストを分ける
describe("小数第3位以下は同じ値に丸められる・ComponentのTypeのVersionの値が違っていても同じ値になる", () => {
  test("Box", () => {
    const input3 = BoxInput3 as unknown as Parameters<typeof res2yaml>[0];
    const output3 = res2yaml(input3);

    const input4 = BoxInput4 as unknown as Parameters<typeof res2yaml>[0];
    const output4 = res2yaml(input4);

    expect(output3).toEqual(output4);
  });
});

//TODO: RootにHolderがあってもなくても同じ値になる
