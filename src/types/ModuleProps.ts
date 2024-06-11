type Props = {
  edit: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  deleteModule: (id: string) => void;
};

export default Props;
