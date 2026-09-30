import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type PropsWithChildren,
} from "react";
import { openRepository } from "../data/database";
import type { Repository } from "../data/repository";
import { DemoSession } from "./controllers";
import { DraftController } from "./draft";
import { localToday } from "../domain/dates";
import { Screen, Feedback } from "../components/ui";
const Context = createContext<{
  repo: Repository;
  uid: string;
  name: string;
  active: boolean;
  enter: (name: string) => void;
  leave: () => void;
  month: string;
  setMonth: (month: string) => void;
  revision: number;
  refresh: () => void;
  draft: DraftController;
} | null>(null);
export function AppProvider({ children }: PropsWithChildren) {
  const [repo, setRepo] = useState<Repository | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, retry] = useReducer((n) => n + 1, 0);
  useEffect(() => {
    let active = true;
    let connection: Repository | null = null;
    void openRepository()
      .then((r) => {
        connection = r;
        if (active) setRepo(r);
        else void r.close();
      })
      .catch((e) => {
        if (active) setError(String(e.message));
      });
    return () => {
      active = false;
      if (connection) void connection.close();
    };
  }, [attempt]);
  if (!repo)
    return (
      <Screen title="Preparando seu espaço">
        <Feedback
          loading={!error}
          error={error}
          retry={() => {
            setError(null);
            retry();
          }}
        />
      </Screen>
    );
  return <ReadyProvider repo={repo}>{children}</ReadyProvider>;
}
function ReadyProvider({
  repo,
  children,
}: PropsWithChildren<{ repo: Repository }>) {
  const [session] = useState(() => new DemoSession());
  const [, render] = useReducer((n) => n + 1, 0);
  const [month, setMonth] = useState(localToday().slice(0, 7));
  const [revision, refresh] = useReducer((n) => n + 1, 0);
  const draft = useMemo(
    () =>
      new DraftController(async (e) => {
        if (
          e.origem === "recorrencia" &&
          e.recorrenciaId &&
          e.competenciaRecorrencia
        )
          await repo.confirmOccurrence(
            e.usuarioId,
            e.recorrenciaId,
            e.competenciaRecorrencia,
            localToday(),
            e,
          );
        else await repo.saveEntry(e);
        refresh();
      }),
    [repo],
  );
  return (
    <Context.Provider
      value={{
        repo,
        uid: "demo-local",
        name: session.name,
        active: session.active,
        enter: (name) => {
          session.enter(name);
          render();
        },
        leave: () => {
          draft.cancel();
          session.leave();
          render();
        },
        month,
        setMonth,
        revision,
        refresh,
        draft,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw Error("AppProvider ausente.");
  return value;
}
