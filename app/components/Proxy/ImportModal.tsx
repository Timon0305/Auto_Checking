import React from 'react';
//@ts-ignore
import Modal from 'react-modal';
import { Button, Div, Icon, ModalTitle, Span } from '../common';
import { ErrorMessage, Field, Form, Formik } from 'formik';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    width: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '20px',
    transform: 'translate(-50%, -50%)',
    background: '#181B27',
    border: 'none'
  }
};

interface Props {
  modalOpen: boolean;
  setIsOpen: any;
  onOK: any;
  initialValue: any;
}

Modal.defaultStyles.overlay.backgroundColor = 'rgba(0 ,0 ,0 ,.8 )';
Modal.setAppElement('body');
const ImportModal = ({ modalOpen, setIsOpen, onOK, initialValue }: Props) => {
  const { id, name, data } = initialValue;

  const afterOpenModal = () => {

  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (

    <Div className="create-task-wrapper" id="createProxy-modal">
      <Div className="create-task">
        <Modal
          isOpen={modalOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <ModalTitle style={{ paddingTop: 10, paddingBottom: 10 }}>{name}</ModalTitle>
          <Div className="j-row flex-align-top">
          </Div>
          <div className="j-row">
            <Formik
              initialValues={{ data: data.join('\n') }}
              validate={values => {
                let errors: any = {};
                if (!values.data) {
                  errors.data = 'Data is required';
                } else if (values.data.trim().split('\n')[0].length < 1) {
                  errors.data = 'Data is required';
                } else {
                  const _ts = values.data.trim().split('\n');
                  for (let _t of _ts) {
                    const __ts = _t.trim().split(':');
                    if (__ts.length != 4) {
                      errors.data = 'Data format is not valid';
                      break;
                    } else {
                      for (let __t of __ts) {
                        if (!__t || __t.length < 1) {
                          errors.data = 'Data is not valid';
                          return errors;
                        }
                      }
                    }
                  }
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  // alert(JSON.stringify(values, null, 2));
                  if (onOK) {
                    onOK({ id, name, data: values.data.trim().split('\n') });
                  }
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({ isSubmitting }) => (<Form className="" style={{ padding: '0 20px' }}>
                <Div className="form-group">
                  <Field as="textarea" className="form-control d-block" name="data" placeholder="IP:Port:Username:Password"/>
                  <ErrorMessage name="data" component="span"/>
                </Div>

                <Div className="flex-center">
                  <Button type="submit"  className="create-pro button">
                    <Span className="create-pro-btn"><Icon className="fas fa-save"
                                                                           disabled={isSubmitting}/></Span>
                    <Span>Save</Span>
                  </Button>
                  <Div className="delete-pro button" onClick={closeModal}>
                    <Button type="button" className="delete-pro-btn"><Icon
                      className="fa fa-window-close"/></Button>
                    <Span>Cancel</Span>
                  </Div>
                </Div>
              </Form>)}
            </Formik>
          </div>
        </Modal>
      </Div>

    </Div>

  );

};

export default ImportModal;
