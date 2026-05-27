import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import { useNavigate } from "react-router";
import { getFlagByNationality } from "../helper/getFlag";
import Flag from "react-flagkit";
import BasicBreadcrumbs from "./BasicBreadcrumbs";

export default function AllDrivers(props) {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        props.setSearch("");
        props.setSearchIsVisible(true);
        props.setSelectIsVisible(true);
        props.setCol2IsVisible(true);
    }, []);

    useEffect(() => {
        getDrivers();
    }, [props.year]);

    useEffect(() => {
        getFilteredData();
    }, [drivers, props.search]);


    const getDrivers = async () => {
        const url = `https://api.jolpi.ca/ergast/f1/${props.year}/driverStandings.json`;
        console.log("drivers url ", url)
        const response = await axios.get(url);
        console.log("response.data", response.data);
        setDrivers(response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings);
        setLoading(false);
    };


    const getFilteredData = () => {
        console.log("getFilteredData");
        let result = drivers;
        //console.log("getFilteredData result ", result);
        result = result.filter((item) =>
            item.Driver.givenName.toLowerCase().includes(props.search.toLowerCase()) ||
            item.Driver.familyName.toLowerCase().includes(props.search.toLowerCase()) ||
            item.Constructors[0].name.toLowerCase().includes(props.search.toLowerCase())
        );

        setFilteredData(result);
    }

    const handleClick = (id) => {
        console.log("id ", id);
        navigate(`/driverDetails/${id}`)
    }

    if (loading) {
        return <Loader />;
    }

    const crumbs = [
        { label: "Drivers", path: "/drivers" }
    ];

    return (
        <div className="wrapper">
            <div className="col2" className="results">
                <BasicBreadcrumbs crumbs={crumbs} />
                <h2>DRIVERS CHAMPIONSHIP - {props.year}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Driver</th>
                            <th>Team</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((driver, i) => {
                            return (
                                <tr key={i}>
                                    <td>{driver.position}</td>
                                    <td
                                        onClick={() => handleClick(driver.Driver.driverId)}>
                                        <div className="link"><Flag country={
                                            getFlagByNationality(props.flags, driver.Driver.nationality)}
                                            size={30} />
                                            {driver.Driver.givenName} {driver.Driver.familyName}
                                        </div>
                                    </td>
                                    <td>{driver.Constructors[0].name}</td>
                                    <td>{driver.points}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div >
    );
}