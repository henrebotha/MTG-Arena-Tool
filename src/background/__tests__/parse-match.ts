/* eslint-env jest */
import { actions } from "../../shared/redux/actions";
import {} from "../index";
import arenaLogWatcher from "../arena-log-watcher";
import globals from "../globals";
import path from "path";
import { playerDb, appDb } from "../../shared/db/LocalDatabase";
import globalStore from "../../shared/store";

const testLogPath = path.join(
  __dirname,
  "..",
  "..",
  "assets",
  "tests",
  "match-test.log"
);

playerDb.init("ABC123", "TesterMan#123456");
appDb.init("test-application");

function doStart(): Promise<void> {
  return new Promise((resolve, reject) => {
    globals.logReadStart = new Date(2020, 1, 1, 0, 0, 0, 0);
    arenaLogWatcher.start({
      path: testLogPath,
      chunkSize: 268435440,
      onLogEntry: arenaLogWatcher.onLogEntryFound,
      onError: (_err: any) => reject(),
      onFinish: resolve,
    });
  });
}

beforeAll(async () => {
  await doStart();
});

describe("parser", () => {
  it("parses a match consistently", () => {
    globalStore.currentMatch.beginTime = new Date("2020-07-30T17:17:34.719Z");
    expect(globalStore.currentMatch).toMatchSnapshot();
  });

  it("parses decks", () => {
    expect(globalStore.decks).toMatchSnapshot();
  });

  it("parses matches", () => {
    expect(globalStore.matches).toMatchSnapshot();
  });

  it("parses events", () => {
    expect(globalStore.events).toMatchSnapshot();
  });

  it("matches redux store", () => {
    globals.store.dispatch(actions["SET_CARDS_TIME"](1596131827815));
    expect(globals.store.getState()).toMatchSnapshot();
  });
});
