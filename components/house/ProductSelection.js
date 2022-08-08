import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import axios from "/instances/axios";
import { cloneDeep, cloneDeepWith, clone } from "lodash-es";
import { toast } from "react-toastify";

//Componentler
import PopupAlert from "/components/pop-up/PopupAlert";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import PreFormLoader from "/components/PreFormLoader";
import Button from "/components/form/Button";

//fonksiyonlar
import {
  getTodayDate,
  writeResponseError,
  numberToTrNumber,
  getNewToken,
  isValidMaskedDate,
  changeDateFormat,
  isValidTcKimlikOrVergiKimlik,
} from "/functions/common";

//Styles
import { inputStyle } from "/styles/custom";
import { radioButtonSx } from "/styles/inputStyle";

const HouseAddress = ({ identityType, identityNo, birthDate, token, onChange }) => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [state, setState] = useState({
    isExistDaskNo: true,
    daskPolicyNo: "",
    brutSquareMeter: "",
    floor: "",
    houseConstructionCost: "",
    itemPrice: "",
  });

  //Radio Button Variables
  const [checkedProductType, setCheckedProductType] = useState("esya");
  const [checkedHouseEmptyStatus, setCheckedHouseEmptyStatus] = useState("");
  const [checkedSecurityCamera, setCheckedSecurityCamera] = useState("");

  //Autocomplete lists
  const buildingEmptyMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  //Autocomplete selected Variables
  const [selectedBuildingEmptyMonth, setSelectedBuildingEmptyMonth] = useState("");

  //normal fonksiyonlar
  const validateData = async (data) => {
    if (onChange) {
      let houseAddress = {
        city: "Gaziantep",
      };
      onChange(houseAddress);
    }
  };

  const onChangeKonutInsaBedeli = (e) => {
    setState({
      ...state,
      houseConstructionCost: e.target.value,
    });
    clearErrors("konutInsaBedeli");
  };

  const onChangeEsyaBedeli = (e) => {
    setState({
      ...state,
      itemPrice: e.target.value,
    });
    clearErrors("esyaBedeli");
  };
  //http requestler

  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit(validateData)}>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          style={{ display: "flex" }}
          value={checkedProductType}
          onChange={(e, value) => {
            setCheckedProductType(value);
            clearErrors();
          }}
        >
          <FormControlLabel value="esya" control={<Radio sx={radioButtonSx} />} label="Eşya" />
          <FormControlLabel value="konut" control={<Radio sx={radioButtonSx} />} label="Konut" />
          <FormControlLabel
            value="konutVeEsya"
            control={<Radio sx={radioButtonSx} />}
            label="Konut ve Eşya"
          />
        </RadioGroup>

        {(checkedProductType == "konut" || checkedProductType == "konutVeEsya") && (
          <>
            <div className="w-100 m-0 p-0" style={{ display: "flex", alignItems: "flex-start" }}>
              <Checkbox
                id="daskNoCheck"
                sx={{
                  padding: "0px 8px 0px 0px",
                  "&.Mui-checked": {
                    color: "var(--color-one)",
                  },
                }}
                checked={!state.isExistDaskNo}
                onChange={(e) => setState({ ...state, isExistDaskNo: !e.target.checked })}
              />
              <label htmlFor="daskNoCheck">DASK Poliçe Numarası Yok</label>
            </div>

            {state.isExistDaskNo ? (
              <div className="dask-no-input">
                <TextField
                  {...register("daskPolicyNo", {
                    required: "Dask Poliçe alanı zorunlu",
                    validate: (value) => value.toString().trim().length == 8,
                  })}
                  value={state.daskPolicyNo}
                  onChange={(e) => {
                    setState({ ...state, daskPolicyNo: e.target.value });
                    setValue("daskPolicyNo", e.target.value);
                    clearErrors("daskPolicyNo");
                  }}
                  className="mt-3"
                  InputProps={{
                    inputProps: {
                      type: "number",
                      maxLength: "8",
                    },
                  }}
                  sx={inputStyle}
                  size="small"
                  error={errors && Boolean(errors["daskPolicyNo"])}
                  label="DASK Poliçe No"
                />
                <small className="text-danger">
                  {errors["daskPolicyNo"]?.message}
                  {/**Validate Message */}
                  {errors.daskPolicyNo &&
                    errors.daskPolicyNo.type == "validate" &&
                    "Geçersiz Dask Poliçe Numarası"}
                </small>
              </div>
            ) : (
              <Alert severity="warning">
                DASK Poliçe Numarası yok olarak girilirse poliçede deprem teminatı olmayacaktır.
              </Alert>
            )}
            {/*Bulunduğu Kat*/}
            <div className="kat mt-4">
              <TextField
                {...register("kat", {
                  required: "Bulunduğu kat alanı zorunlu",
                })}
                value={state.floor}
                onChange={(e) => {
                  setState({
                    ...state,
                    floor: e.target.value,
                  });
                  clearErrors("kat");
                }}
                InputProps={{
                  inputProps: {
                    type: "number",
                    maxLength: "2",
                  },
                }}
                sx={inputStyle}
                size="small"
                error={Boolean(errors["kat"])}
                label="Bulunduğu Kat"
                maxLength={4}
                name="kat"
              />
              <small className="text-danger">{errors["kat"]?.message}</small>
            </div>
            {/*Evin Boş Kalma Durumu*/}
            <div className="ev-bos-kalma-durumu mt-4">
              <div className="selection-empty-status">
                <span
                  style={{
                    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "1rem",
                  }}
                >
                  Konut bir yıl içinde 1 aydan daha fazla boş kalıyor mu ?
                </span>

                <Controller
                  rules={{ required: "Lütfen evin boş kalma durumunu seçiniz!" }}
                  control={control}
                  name="radioHouseEmptyStatus"
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      row
                      style={{ display: "flex" }}
                      onChange={(e, value) => {
                        setCheckedHouseEmptyStatus(value);
                        setValue("radioHouseEmptyStatus", value);
                        clearErrors("radioHouseEmptyStatus");
                      }}
                    >
                      <FormControlLabel
                        value="evet"
                        control={<Radio sx={radioButtonSx} />}
                        label="Evet"
                      />
                      <FormControlLabel
                        value="hayir"
                        control={<Radio sx={radioButtonSx} />}
                        label="Hayır"
                      />
                    </RadioGroup>
                  )}
                />

                <small className="text-danger">
                  {errors && errors["radioHouseEmptyStatus"]?.message}
                </small>
              </div>
              {checkedHouseEmptyStatus == "evet" && (
                <div className="bina-bos-kalan-ay-sayisi mt-2">
                  <Autocomplete
                    value={selectedBuildingEmptyMonth}
                    onChange={(event, newValue) => {
                      setSelectedBuildingEmptyMonth(newValue);
                    }}
                    options={buildingEmptyMonths}
                    getOptionLabel={(option) => (option ? option + " Ay" : "")}
                    sx={{ width: "100%" }}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Boş Kalan Ay Sayısı"
                        placeholder="Boş Kalan Ay Sayısı Seçiniz"
                        required={true}
                        InputProps={{
                          ...params.InputProps,
                        }}
                      />
                    )}
                  />
                </div>
              )}
            </div>
            {/*Evin Boş Kalma Durumu*/}
            <div
              className="guvenlik-kamerasi-varmi mt-3
            
            "
            >
              <div className="selection-security-camera">
                <span
                  style={{
                    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "1rem",
                  }}
                >
                  7/24 Güvenlik var mı ?
                </span>

                <Controller
                  rules={{ required: "Lütfen 7/24 kamera olup olmama durumunu seçiniz!" }}
                  control={control}
                  name="radioSecurityCamera"
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      row
                      style={{ display: "flex" }}
                      value={checkedSecurityCamera}
                      onChange={(e, value) => {
                        setCheckedSecurityCamera(value);
                        setValue("radioSecurityCamera", value);
                        clearErrors("radioSecurityCamera");
                      }}
                    >
                      <FormControlLabel
                        value="evet"
                        control={<Radio sx={radioButtonSx} />}
                        label="Evet"
                      />
                      <FormControlLabel
                        value="hayir"
                        control={<Radio sx={radioButtonSx} />}
                        label="Hayır"
                      />
                    </RadioGroup>
                  )}
                />

                <small className="text-danger">
                  {errors && errors["radioSecurityCamera"]?.message}
                </small>
              </div>
            </div>
            {/*Brut Metre Kare*/}
            <div className="brut-metre-kare mt-4">
              <TextField
                {...register("brutMetreKare", {
                  required: "Brut metre kare alanı zorunlu",
                  minLength: {
                    value: 2,
                    message: "En az iki hane olmak zorunda",
                  },
                })}
                type="number"
                value={state.brutSquareMeter}
                onChange={(e) => {
                  setState({
                    ...state,
                    brutSquareMeter: e.target.value,
                  });
                  clearErrors("brutMetreKare");
                }}
                sx={inputStyle}
                size="small"
                error={Boolean(errors["brutMetreKare"])}
                label="Brüt Metre Kare"
                maxLength={4}
                name="brutMetreKare"
              />
              <small className="text-danger">{errors["brutMetreKare"]?.message}</small>
            </div>
            {/*Konut İnşa Bedeli*/}
            <div className="konut-insa-bedeli mt-4">
              <TextField
                {...register("konutInsaBedeli", {
                  required: "Konut inşa bedeli alanı zorunlu",
                  minLength: {
                    value: 2,
                    message: "En az iki hane olmak zorunda",
                  },
                })}
                value={state.houseConstructionCost}
                onChange={(e) => {
                  onChangeKonutInsaBedeli(e);
                }}
                onKeyUp={(e) => {
                  onChangeKonutInsaBedeli(e);
                }}
                InputProps={{
                  inputProps: {
                    maxLength: "20",
                    className: "only-number-mask",
                  },
                }}
                sx={inputStyle}
                size="small"
                error={Boolean(errors["konutInsaBedeli"])}
                label="Konut İnşa Bedeli (TL)"
              />
              <small className="text-danger">{errors["konutInsaBedeli"]?.message}</small>
            </div>
            {/*Eşya Bedeli*/}
            <div className="esya-bedeli mt-4">
              <TextField
                {...register("esyaBedeli", {
                  required: "Eşya bedeli alanı zorunlu",
                  validate: (value) => Number(value.trim().replaceAll(".", "")) >= 15000,
                })}
                value={state.itemPrice || ""}
                onChange={(e) => {
                  onChangeEsyaBedeli(e);
                }}
                onKeyUp={(e) => {
                  onChangeEsyaBedeli(e);
                }}
                InputProps={{
                  inputProps: {
                    maxLength: "20",
                    className: "only-number-mask",
                  },
                }}
                sx={inputStyle}
                size="small"
                error={Boolean(errors["esyaBedeli"])}
                label="Eşya Bedeli (TL)"
              />
              <small className="text-danger">
                {errors["esyaBedeli"]?.message}
                {errors.esyaBedeli &&
                  errors.esyaBedeli.type == "validate" &&
                  "Eşya bedeli en az 15.000 TL olmak zorunda"}
              </small>
            </div>
          </>
        )}
        <Button
          type="submit"
          className="w-100 mt-4"
          //disabled={!state.address}
        >
          İleri
        </Button>
      </form>
    </>
  );
};

export default HouseAddress;
