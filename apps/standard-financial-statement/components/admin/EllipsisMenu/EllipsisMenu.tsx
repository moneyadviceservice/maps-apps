import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Modal } from 'components/Modal';
import { Organisation } from 'types/Organisations';

import { Button } from '@maps-react/common/components/Button';

import { useEditMode } from '../../../contexts/EditModeContext';
import { ActionModalContent } from '../profile/ManageLicence/ActionModalContent';

type Props = {
  data: Organisation;
};

export const EllipsisMenu = ({ data }: Props) => {
  const router = useRouter();
  const { setIsEditMode } = useEditMode();

  const menuRef = useRef<HTMLDivElement>(null);

  const [showMenu, setShowMenu] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const deleteOrganisation = async () => {
    const cosmosDeleteParams = {
      licence_number: data.licence_number,
    };

    try {
      await fetch(`/api/delete-organisation`, {
        method: 'DELETE',
        body: JSON.stringify(cosmosDeleteParams),
      });
    } catch (err) {
      console.error((err as Error).message);
      setError((err as Error).message);

      return err;
    }

    setModalOpen(false);
    router.push('/admin/dashboard');
  };

  return (
    <div ref={menuRef} className="relative">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        target="_blank"
        variant="secondary"
        className="flex justify-center h-10 w-10 text-xl font-bold hover:bg-gray-100 rounded text-gray-400"
        data-testid="ellipsis-menu"
      >
        <span className="-mt-2">...</span>
      </Button>
      {showMenu && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-400 rounded shadow-lg w-52">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-200 rounded-t"
            onClick={() => {
              setIsEditMode(true);
              setShowMenu(false);
            }}
          >
            Edit organisation
          </button>
          <button
            className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-b"
            onClick={() => {
              setModalOpen(true);
              setShowMenu(false);
            }}
            data-testid="ellipsis-delete-button"
          >
            Delete organisation
          </button>
        </div>
      )}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          data-testid="modal-container"
        >
          <ActionModalContent
            action={'delete'}
            orgName={data.name}
            onCancel={() => setModalOpen(false)}
            onConfirm={deleteOrganisation}
            error={error}
          />
        </Modal>
      )}
    </div>
  );
};
