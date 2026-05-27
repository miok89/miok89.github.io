import { BrowserRouter, Link, Route, Routes } from "react-router";
import Home from "./components/Home";
import AllDrivers from "./components/AllDrivers";
import AllTeams from "./components/AllTeams";
import AllRaces from "./components/AllRaces";
import DriverDetails from "./components/DriverDetails";
import TeamDetails from "./components/TeamDetails";
import RaceDetails from "./components/RaceDetails";
import { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Box, InputLabel, MenuItem, FormControl, Select, colors } from "@mui/material";
import { grey } from "@mui/material/colors";


export default function App() {
  const [flags, setFlags] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); //defoltna godina
  const [search, setSearch] = useState(""); //za input text
  const [searchIsVisible, setSearchIsVisible] = useState(false);
  const [selectIsVisible, setSelectIsVisible] = useState(false);
  const [col2IsVisible, setCol2IsVisible] = useState(false);

  useEffect(() => {
    getFlags();
    getYears();
  }, []);

  const getFlags = async () => {
    const url = "https://raw.githubusercontent.com/Imagin-io/country-nationality-list/refs/heads/master/countries.json";
    const response = await axios.get(url);
    console.log("flags response ", response);
    setFlags(response.data);
  }

  const getYears = () => {
    //uzima se poslednjih 30 godina
    const years = [];
    let y = new Date().getFullYear();
    for (let i = 0; i < 30; i++) {
      years.push(y);
      y--;
    }
    //console.log("years ",years);
    setYears(years);
  }

  return (
    <BrowserRouter>
      <div className="wrapper">
        <div>
          <video loop autoPlay muted id="bg-video"
            src="./public/home-video/clip-race.mp4" type="video/mp4"
            poster="./public/home-video/video-poster.jpg"
          >
          </video>
        </div>
        <div className="col1">
          <nav>
            <div>
              <img style={{ backgroundColor: "darkgray", borderRadius: "15px" }}
                src="../img/logo.png" alt="Logo" />
            </div>

            <div style={selectIsVisible ? { visibility: "visible" } : { visibility: "hidden" }}  >
              <FormControl className="select-search" sx={{ m: 1, minWidth: 120 }} >
                <InputLabel id="selectLabelId" className="menuIcons">Season</InputLabel>
                <Select
                  variant="filled" //variant="standard"
                  inputprops={{
                      disableUnderline: true
                    }}
                  labelId="selectId"
                  value={selectedYear}
                  label="Season"
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((year) => {
                    return (
                      <MenuItem value={year}>{year}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div style={searchIsVisible ? { visibility: "visible" } : { visibility: "hidden" }} >
              <FormControl 
              sx={{ m: 1, minWidth: 120 }} >
                <span className="select-search">
                  <TextField
                    variant="filled" //variant="standard"
                    inputprops={{
                      disableUnderline: true
                    }}
                    id="searchId"
                    label="Search table:"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}

                  />
                </span>
              </FormControl>
            </div>

            <div className="vNav">
              <ul>
                <Link to="/drivers"><li><img src="../img/Kaciga.png" alt="Drivers logo" /><div className="menuIcons">Drivers</div></li></Link>
                <Link to="/teams"><li><img src="../img/Teams.png" alt="Teams logo" /><div className="menuIcons">Teams</div></li></Link>
                <Link to="/races"><li><img src="../img/Races1.png" alt="Races logo" /><div className="menuIcons">Races</div></li></Link>
              </ul>
            </div>
          </nav>
        </div>
        <div className={col2IsVisible ? "col2" : "col3"}>
          <Routes>
            <Route path="/" element={<Home
              setSearchIsVisible={setSearchIsVisible} setSelectIsVisible={setSelectIsVisible} setCol2IsVisible={setCol2IsVisible} />} />
            <Route path="/drivers" element={<AllDrivers flags={flags} year={selectedYear}
              search={search} setSearch={setSearch} setSearchIsVisible={setSearchIsVisible} setSelectIsVisible={setSelectIsVisible} setCol2IsVisible={setCol2IsVisible} />} />
            <Route path="/teams" element={<AllTeams flags={flags} year={selectedYear}
              search={search} setSearch={setSearch} setSearchIsVisible={setSearchIsVisible} setSelectIsVisible={setSelectIsVisible} setCol2IsVisible={setCol2IsVisible} />} />
            <Route path="/races" element={<AllRaces flags={flags} year={selectedYear}
              search={search} setSearch={setSearch} setSearchIsVisible={setSearchIsVisible} setSelectIsVisible={setSelectIsVisible} setCol2IsVisible={setCol2IsVisible} />} />
            <Route path="/driverDetails/:id" element={<DriverDetails flags={flags} year={selectedYear}
              search={search} setSearch={setSearch} setSearchIsVisible={setSearchIsVisible} setSelectIsVisible={setSelectIsVisible} setCol2IsVisible={setCol2IsVisible} />} />
            <Route path="/driverRaces/:id" element={<DriverDetails flags={flags} year={selectedYear}
              search={search} setSearch={setSearch} setSearchIsVisible={setSearchIsVisible} setSelectIsVisible={setSelectIsVisible} setCol2IsVisible={setCol2IsVisible} />} />
            <Route path="/teamDetails/:id" element={<TeamDetails flags={flags} year={selectedYear}
              search={search} setSearch={setSearch} setSearchIsVisible={setSearchIsVisible} setSelectIsVisible={setSelectIsVisible} setCol2IsVisible={setCol2IsVisible} />} />
            <Route path="/raceDetails/:id" element={<RaceDetails flags={flags} year={selectedYear}
              search={search} setSearch={setSearch} setSearchIsVisible={setSearchIsVisible} setSelectIsVisible={setSelectIsVisible} setCol2IsVisible={setCol2IsVisible} />} />
          </Routes>
        </div>
      </div>
      <footer>
        <p>&copy; 2026 Green classroom group II. All rights reserved.</p>
        <address>
          Contact us at <a href="mailto:school@smartschool.rs">school@smartschool.rs</a>
        </address>
      </footer>
    </BrowserRouter>
  );
}