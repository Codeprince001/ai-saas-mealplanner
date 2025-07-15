import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useState } from "react";

interface UnsubscribeModalProps {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  unsubscribeMutation: () => void;
}

const UnsubscribeModal = ({openModal, setOpenModal, unsubscribeMutation}: UnsubscribeModalProps) => {

  const handleAccept = () => {
    setOpenModal(false)
    unsubscribeMutation()
  }
  return (
    <div>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader className="text-center">Do you want to Unsubscribe?</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 text-center">
             Clicking accept would unsubscribe you from your current pla
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="mx-auto">
          <Button onClick={handleAccept}>I accept</Button>
          <Button color="alternative" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default UnsubscribeModal