import FastAccessType from "../../fastaccess/model/FastAccessType";
import { ModuleType } from "./ModulesType";

type Props = {
  key?: string;
  onDragStart: () => void;
  deleteModule: (id: string) => void;
  changeModule: (module: ModuleType) => void;
  fastAccess: FastAccessType | null;
};

export default Props;
