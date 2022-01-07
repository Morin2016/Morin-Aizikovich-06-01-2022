import React from 'react';
import './style.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

const ToastNotify = ({ message, show, type, setNotify }) => {
      const customId = 'toastify-id';

      if (!show) {
            return (<noscript />)
      }

      const notify = () => {
            toast(
                  message,
                  {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 8000,
                        closeOnClick: true,
                        closeButton: true,
                        toastId: customId,
                        onClose: () => onCloseSetShowFalse(),
                        type: type
                  })

      }

      const onCloseSetShowFalse = () => {
            setNotify(oldData => {
                  return { ...oldData, show: false }
            })
      }

      return (
            <div>
                  {notify()}
            </div>
      )
}

export default ToastNotify