import { describe, test, jest, expect } from "@jest/globals";

describe("displayLog", () => {
  jest.spyOn(console, "log").mockImplementation(() => { });

  test("checking all possible log types", async () => {
    const { displayLog } = await import("../logger.ts");
    const testString: string = "TESTABCD";

    displayLog(testString, "LOG");

    expect(console.log).toHaveBeenCalledTimes(3);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("LOG" + "|| : \n" + testString)
    );

    displayLog(testString, "ERR");

    expect(console.log).toHaveBeenCalledTimes(6);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("ERR" + "|| : \n" + testString)
    );

    displayLog(testString, "WAR");

    expect(console.log).toHaveBeenCalledTimes(9);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("WAR" + "|| : \n" + testString)
    );

  });

  test("null text", async () => {
    const { displayLog } = await import("../logger.ts");

    expect(() => {
      displayLog(null, "LOG");
    }).toThrow("Text not provided");

  });

  test("wrong logtype", async () => {
    const { displayLog } = await import("../logger.ts");
    const testString: string = "TESTABCD";

    expect(() => {
      displayLog(testString, "ILLEGAL");
    }).toThrow("Illegal Log Type");
  });


});
