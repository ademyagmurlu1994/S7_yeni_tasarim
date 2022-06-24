import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";

import BaseSelect from "react-select";
import RequiredSelect from "/components/RequiredSelect";

const NotificationConfirmation = ({ notificationCallback, show, id }) => {
  const Select = (props) => <RequiredSelect {...props} SelectComponent={BaseSelect} />;
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [state, setState] = useState({
    bankInstutions: [
      { value: "0", label: "A BANKASI" },
      { value: "1", label: "B BANKASI" },
      { value: "2", label: "C BANKASI" },
      { value: "3", label: "D BANKASI" },
    ],

    branchBanks: [
      { value: "0", label: "A ŞUBESİ" },
      { value: "1", label: "B ŞUBESİ" },
      { value: "2", label: "C ŞUBESİ" },
      { value: "3", label: "D ŞUBESİ" },
    ],
    isDainiMurtehinAdded: false,
  });
  const [selectedBankInstution, setSelectedBankInstution] = useState();
  const [selectedBranchBank, setSelectedBranchBank] = useState();

  useEffect(() => {
    if (show) {
      $("#" + id).modal("show");
    } else {
      $("#" + id).modal("hide");
    }
  }, [show]);

  const dainiMurtehinAdd = () => {
    //setState({ ...state, isDainiMurtehinAdded: true });
    document.getElementById("closeModal").click();
  };

  return (
    <>
      {/* Pop-up Notificiation Modal*/}
      <div
        className="modal fade"
        id={id}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Daini Mürtehi Ekleme
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form autoComplete="off" onSubmit={handleSubmit(dainiMurtehinAdd)}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12 w-100">
                    <Select
                      instanceId="bankInstution"
                      options={state.bankInstutions}
                      onChange={setSelectedBankInstution}
                      value={selectedBankInstution}
                      isClearable
                      placeholder="Lütfen Kurum Seçiniz..."
                      required
                    />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-12 w-100">
                    <Select
                      instanceId="branchBank"
                      options={state.branchBanks}
                      onChange={setSelectedBranchBank}
                      value={selectedBranchBank}
                      isClearable
                      placeholder="Lütfen Şube Seçiniz..."
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className="btn btn-secondary" data-dismiss="modal" id="closeModal">
                  Kapat
                </div>
                <input type="submit" className="btn-main btn-large" value=" Ekle" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationConfirmation;
