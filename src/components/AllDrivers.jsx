import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import { Link, useNavigate } from "react-router";
import { getFlagByNationality } from "../helper/getFlag";
import Flag from "react-flagkit";
import BasicBreadcrumbs from "./BasicBreadcrumbs";

export default function AllDrivers(props) {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const [sortByCollName, setSortByCollName] = useState("");

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

    useEffect(() => {
        sortData(sortByCollName);        
    }, [filteredData, sortByCollName]);

    const sortData = (collName) => {
        console.log("sortData collName", collName); 
        let result = filteredData;
        switch (collName) {
            case "position": result = result.sort((a, b) => Number(a.position) - Number(b.position));                
                break;
            case "driver": result = result.sort((a, b) =>
                (a.Driver.givenName+a.Driver.familyName).toLowerCase().localeCompare((b.Driver.givenName+b.Driver.familyName).toLowerCase()));
                break;
            case "team": result = result.sort((a, b) =>
                a.Constructors[0].name.toLowerCase().localeCompare(b.Constructors[0].name.toLowerCase()));
                break;
            case "points": result = result.sort((a, b) => Number(a.points) - Number(b.points));
                break;
        }
        setFilteredData(result);
    }

/*    
    const dynamicSort = (property, order = 'asc') => {
        return (a, b) => {
            const comparison = a[property].localeCompare(b[property])
            return order === 'desc' ? -comparison : comparison
        }
    }

    items.sort(dynamicSort('name', 'asc'))
*/


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
                            <th onClick={() => setSortByCollName("position")} 
                                style={sortByCollName==="position"? {backgroundColor:"red"} : {backgroundColor:"lightgrey"}}
                                ><Link>Position</Link></th>
                            <th onClick={() => setSortByCollName("driver")}
                                style={sortByCollName==="driver"? {backgroundColor:"red"} : {backgroundColor:"lightgrey"}}
                                ><Link>Driver</Link></th>
                            <th onClick={() => setSortByCollName("team")}
                                style={sortByCollName==="team"? {backgroundColor:"red"} : {backgroundColor:"lightgrey"}}
                                ><Link>Team</Link></th>
                            <th onClick={() => setSortByCollName("points")}
                                style={sortByCollName==="points"? {backgroundColor:"red"} : {backgroundColor:"lightgrey"}}
                                ><Link>Points</Link></th>
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