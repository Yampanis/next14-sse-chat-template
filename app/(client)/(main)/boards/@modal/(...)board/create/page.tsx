import { BoardForm } from '@components/boards/boardForm';
import { Modal } from '@components/ui/modal';
import type { IBoard } from 'app/server/boards/interfaces';

export default async function BoardCreateModal() {
  return (
    <Modal>
      <BoardForm board={{} as IBoard} />
    </Modal>
  );
}
