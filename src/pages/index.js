import HomePage from "@/pages/components/Home/HomePage";
import HomeFAQs from "@/pages/components/Home/HomeFAQs";
import Footer from "@/pages/components/Footer";
import VideoPlayer from "@/pages/components/utils/VideoPlayer";
import { useTranslation } from 'react-i18next';
const Home = () => {


    return (
      <>
        <div
          id={`main-container`}
          className={`w-full bg-light h-full flex flex-col items-center justify-start`}
        >
          <HomePage />
          <br />
          <br />
          <div className={`lg:hidden`}>
            <br />
          </div>
          <div className={`w-full h-full block lg:hidden`}>
            <VideoPlayer />
          </div>

          <div className={`block lg:hidden bg-white w-full h-full z-20`}>
            <HomeFAQs />
          </div>

          <div className="w-full mt-14">
            <Footer />
          </div>
        </div>
      </>
    );
}

export default Home;