import { ModuleType } from "./ModulesType";

type Props = {
  key?: string;
  edit: boolean;
  onDragStart: () => void;
  deleteModule: (id: string) => void;
  changeModule: (module: ModuleType) => void;
};

export default Props;
