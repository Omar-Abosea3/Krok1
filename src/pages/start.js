import ActionButton from "@/pages/components/utils/ActionButton";
import {useRouter} from "next/router";
import CheckButton from "@/pages/components/utils/CheckButton";
import Footer from "@/pages/components/Footer";
import NavBar from "@/pages/components/NavBar";
import {useAuth} from "@/context/AuthContext";
import SplashScreen from "@/pages/components/SplashScreen";
import {useEffect, useState} from "react";
import {getLanguages, getSpecificities, getLevels} from "@/components/services/questions";
import {toast} from "react-toastify";
import SearchBar from "@/pages/components/Home/SearchBar";
import SectionsHeader from "@/pages/components/SectionsHeader";
import {useTranslation} from "react-i18next";
import Image from "next/image";
import notificationsIcon from "../../public/🦆 icon _bell notification_.svg";
import userIcon from "../../public/profile.svg";


const Start = () => {
    const {t, i18n} = useTranslation("common");
    const router = useRouter();
    const {token,user, loading} = useAuth();


    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [selectedSpecificity, setSelectedSpecificity] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);

    const [languages, setLanguages] = useState([]);
    const [specificities, setSpecificities] = useState([]);
    const [levels, setLevels] = useState([]);
    let userProfilePhoto = userIcon;
    if (user) {
        userProfilePhoto = user.profile_photo.toString().length <= 50 ? userIcon : user.profile_photo;
    }
    useEffect(() => {
        const existingState = JSON.parse(localStorage.getItem("state"));
        if(existingState){
            setSelectedLanguage(existingState.language);
            setSelectedSpecificity(existingState.specificity);
            setSelectedLevel(existingState.level);
        }
    }, []);

    useEffect(() => {
        if (token) {
            getLanguages(token).then((response) => {
                setLanguages(response);
            }).catch((error) => {
                console.error('Error fetching languages:', error);
            });
            getSpecificities(token).then((response) => {
                setSpecificities(response);
            }).catch((error) => {
                console.error('Error fetching specificities:', error);
            });
            getLevels(token).then((response) => {
                setLevels(response);
            }).catch((error) => {
                console.error('Error fetching levels:', error);
            });
        }
    }, [token]);


    useEffect(() => {
        if (!loading && !token) {
            router.push('/signin');
        }
    }, [token, loading, router]);

    if (loading) {
        return <SplashScreen/>
    }

    if (!levels || !languages || !specificities) {
        return <SplashScreen/>
    }


    function handleNext() {
        if (!selectedLevel || !selectedLanguage || !selectedSpecificity) {
            if(toast.isActive){
                toast.dismiss();
                toast.error(`${t("PleaseSelectAtLeastOne")}`);
            }
            return;
        }
        localStorage.setItem("state", JSON.stringify({
            "language": selectedLanguage,
            "specificity": selectedSpecificity,
            "level": selectedLevel
        }));
        router.push({
            pathname: '/year'
        });
    }

    return (
      <div className="w-full h-screen flex flex-col items-start justify-center ">
        <div className="w-full h-fit hidden sm:block ">
          <div
            className={`w-full  h-fit flex items-center justify-between px-4 mt-1`}
          >
            <div className="">
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  router.push("/profile");
                }}
                id={`profile-icon-container`}
                className={`w-full h-full flex items-center justify-end pe-10`}
              >
                <Image
                  width={35}
                  height={35}
                  src={userProfilePhoto}
                  alt={`profile`}
                  objectFit={`cover`}
                  className={`w-10 h-10 rounded-full me-2`}
                />
                <div className={`flex h-full flex-col`}>
                  {token ? (
                    <>
                      <div className={`text-xs text-black`}>
                        {t("Hello")}, {user?.first_name}
                      </div>
                      <div className={`text-sm text-black`}>{t("Welcome")}</div>
                    </>
                  ) : (
                    <div>
                      <div className={`text-sm text-black`}>{t("SignIn")}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <SearchBar />
          <SectionsHeader />
        </div>
        <NavBar />
        <div
          className="w-full h-screen  flex flex-col 
        items-center justify-center sm:px-10 sm:py-10"
        >
          <div className="w-full h-full  px-20 sm:px-2 flex flex-col items-start justify-center">
            <div
              className="w-full h-fit font-bold text-5xl
                     text-ldarkBlue sm:text-sm"
            >
              {t("PleaseChoose")}
            </div>
            <div
              id="lang"
              className="sm:w-full flex sm:flex-col sm:items-start items-center justify-center my-10"
            >
              <div className="w-32 sm:mx-4 font-semibold text-2xl text-ldarkBlue">
                {t("Language")}
              </div>
              <div className="sm:w-full grid grid-cols-3 lg:grid-cols-2 mx-10 sm:mx-0">
                {languages.map((language, index) => {
                  return (
                    <div key={index}>
                      <CheckButton
                        key={index}
                        text={language.name}
                        isSelected={selectedLanguage === language.id}
                        onClick={() => {
                          if (selectedLanguage === language.id) {
                            setSelectedLanguage(null);
                          } else {
                            setSelectedLanguage(language.id);
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              id="spec"
              className="sm:w-full flex sm:flex-col sm:items-start items-center justify-center mb-10"
            >
              <div className="w-32 sm:w-full sm:mx-4 font-semibold text-2xl text-ldarkBlue">
                {t("Specialty")}
              </div>
              <div className="sm:w-full grid grid-cols-4 lg:grid-cols-2 mx-10 sm:mx-0">
                {specificities.map((specific, index) => (
                  <CheckButton
                    key={index}
                    text={specific.name}
                    isSelected={selectedSpecificity === specific.id}
                    onClick={() => setSelectedSpecificity(specific.id)}
                  />
                ))}
              </div>
            </div>
            <div
              id="level"
              className="sm:w-full w-fit flex sm:flex-col sm:items-start items-center justify-center my-0"
            >
              <div className="w-32 sm:w-full sm:mx-4 font-semibold text-2xl text-ldarkBlue">
                {t("Level")}
              </div>
              <div className="sm:w-full  grid grid-cols-4 lg:grid-cols-2 mx-10 sm:mx-0">
                {levels.map((level, index) => (
                  <CheckButton
                    key={index}
                    text={level.name}
                    isSelected={selectedLevel === level.id}
                    onClick={() => setSelectedLevel(level.id)}
                  />
                ))}
              </div>
            </div>
            <div
              onClick={handleNext}
              id="next-btn"
              className="w-2/3  sm:w-full mt-10 "
            >
              <ActionButton text={`${t("Next")}`} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
};

export default Start;
