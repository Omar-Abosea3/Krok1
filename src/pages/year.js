import {useRouter} from "next/router";

import ActionButton from "@/pages/components/utils/ActionButton";
import CheckButton from "@/pages/components/utils/CheckButton";
import Footer from "@/pages/components/Footer";
import NavBar from "@/pages/components/NavBar";
import StepBar from "@/pages/components/utils/StepBar";
import React, {useEffect, useState} from "react";
import {useAuth} from "@/context/AuthContext";
import {getYears} from "@/components/services/questions";
import {toast} from "react-toastify";
import SearchBar from "@/pages/components/Home/SearchBar";
import SectionsHeader from "@/pages/components/SectionsHeader";
import {useTranslation} from "react-i18next";

const Year = () => {
    const {t, i18n} = useTranslation("common");
    const router = useRouter();
    const {token, loading} = useAuth();
    const [state, setState] = useState(null);
    const [selectedYears, setSelectedYears] = useState([]);
    const [years, setYears] = useState([]);

    useEffect(() => {
        if (token && state) {
            getYears(token, state).then((response) => {
                setYears(response);
            }).catch((error) => {
                console.error('Error fetching years:', error);
            });
        }
    }, [token, state]);

    useEffect(() => {
        setState(JSON.parse(localStorage.getItem("state")));
    }, []);


    function handleNext() {
        if (selectedYears.length === 0) {
            if(toast.isActive){
                toast.dismiss();
                toast.error("Please select at least one year");
            }
            return;
        }
        localStorage.setItem("state", JSON.stringify({...state, "years": selectedYears}));
        router.push("/filter");
    }

    return (
      <div
        className={`w-full h-screen flex flex-col items-start justify-between bg-white`}
      >
        <div className={`w-full h-fit hidden md:block`}>
          <SearchBar />
          <SectionsHeader />
        </div>
        <NavBar />

        <div className={`w-full h-full flex flex-col items-start px-8`}>
          <div
            className={`w-full h-full flex flex-col items-start justify-center md:pt-0`}
          >
            <StepBar
              stepNumber={1}
              onStepClicked={(step) => {
                router.push(`/${step}`);
              }}
            />
            <div
              className={`sm:w-full h-fit mt-10 grid grid-cols-6 lg:grid-cols-2 md:grid-cols-2`}
            >
              {years.map((year, index) => {
                return (
                  <div key={index}>
                    <CheckButton
                      text={year.year}
                      key={index}
                      isSelected={selectedYears.includes(year.id)}
                      onClick={() => {
                        if (selectedYears.includes(year.id)) {
                          setSelectedYears(
                            selectedYears.filter((item) => item !== year.id)
                          );
                        } else {
                          setSelectedYears([...selectedYears, year.id]);
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className={`h-fit  flex flex-row w-2/3`}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  router.replace("/start");
                }}
                id={`next-btn`}
                className={`w-1/3 sm:w-full mt-10`}
              >
                <ActionButton
                  text={`${t("Back")}`}
                  className={`!bg-gray-400`}
                />
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={handleNext}
                id={`next-btn`}
                className={`w-2/3 sm:w-full mt-10 mx-2`}
              >
                <ActionButton text={`${t("Next")}`} />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
};

export default Year;