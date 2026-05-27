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
    const [sortedData, setSortedData] = useState([]);    
    //!!!type je visak jer ga preciziram, t.j. ne znam da ga prosledim
    const [sortColumns, setSortColumns] = useState([
        { coll: 1, type: "number", sorted: true, asc: true },
        { coll: 2, type: "string", sorted: false, asc: false },
        { coll: 3, type: "string", sorted: false, asc: false },
        { coll: 4, type: "number", sorted: false, asc: false }
    ]
    );

    const [currSortedCol, setCurrSortedCol] = useState({ coll: 1, type: "number", sorted: true, asc: true });

    /*
     const [sortByCollNum, setSortByCollNum] = useState(0);
     const [sortType, setSortType] = useState("numeric");
     const [sortAscOrder, setSortAscOrder] = useState(false);
     */


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
        sortData(currSortedCol);

        // sortData({coll: 0,type:"numeric",asc:!order})>Position</th>
        // sortByCollNum sortType sortAscOrder

    }, [filteredData, currSortedCol]);

    const sortData = (currSortedCol) => {
        console.log("sortData currSortedCol", currSortedCol);
        let resultAllColl = sortColumns;
        //setFilteredCountries(result.sort((a, b) => a.name.localeCompare(b.name)));

        let result = filteredData;
        switch (currSortedCol.coll) {
            case 1:   //sortiranje za brojeve - Position 
                if (currSortedCol.asc) {
                    result = result.sort((a, b) => Number(a.position) - Number(b.position));
                } else {
                    result = result.sort((a, b) => Number(b.position) - Number(a.position));
                }

                break;

            case 2:
                //sortiranje za tekst -Driver    
                if (currSortedCol.asc) {
                    result = result.sort((a, b) =>
                        (a.Driver.givenName + a.Driver.familyName).toLowerCase().localeCompare((b.Driver.givenName + b.Driver.familyName).toLowerCase()));
                } else {
                    result = result.sort((a, b) =>
                        (b.Driver.givenName + b.Driver.familyName).toLowerCase().localeCompare((a.Driver.givenName + a.Driver.familyName).toLowerCase()));
                }

                break;

            case 3:
                //sortiranje za tekst - Team    
                if (currSortedCol.asc) {
                    result = result.sort((a, b) =>
                        a.Constructors[0].name.toLowerCase().localeCompare(b.Constructors[0].name.toLowerCase()));
                } else {
                    result = result.sort((a, b) =>
                        b.Constructors[0].name.toLowerCase().localeCompare(a.Constructors[0].name.toLowerCase()));
                }

                break;

            case 4:
                //sortiranje za brojeve - Points       
                if (currSortedCol.asc) {
                    result = result.sort((a, b) => Number(a.position) - Number(b.position));
                } else {
                    result = result.sort((a, b) => Number(b.position) - Number(a.position));
                }

                break;
        }
        setSortedData(result);
        resultAllColl[currSortedCol.coll - 1] = currSortedCol.coll;
        setSortColumns(resultAllColl);
    }


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
        setSortedData(filteredData);
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
                            <th onClick={() =>
                                setCurrSortedCol(
                                    {
                                        coll: sortColumns[0].coll, type: sortColumns[0].type,
                                        sorted: true, asc: !sortColumns[0].asc
                                    }
                                )}
                            >Position {sortColumns[0].sorted ?
                                (sortColumns[0].asc ? '▲' : '▼')
                                : ""
                                }
                            </th>
                            <th onClick={() =>
                                setCurrSortedCol(
                                    {
                                        coll: sortColumns[1].coll, type: sortColumns[1].type,
                                        sorted: true, asc: !sortColumns[0].asc
                                    }
                                )}
                            >Driver {sortColumns[1].sorted ?
                                (sortColumns[1].asc ? '▲' : '▼')
                                : ""
                                }
                            </th>
                            <th onClick={() =>
                                setCurrSortedCol(
                                    {
                                        coll: sortColumns[2].coll, type: sortColumns[2].type,
                                        sorted: true, asc: !sortColumns[0].asc
                                    }
                                )}
                            >Team  {sortColumns[2].sorted ?
                                (sortColumns[2].asc ? '▲' : '▼')
                                : ""
                                }
                            </th>
                            <th onClick={() =>
                                setCurrSortedCol(
                                    {
                                        coll: sortColumns[3].coll, type: sortColumns[3].type,
                                        sorted: true, asc: !sortColumns[0].asc
                                    }
                                )}
                            >Points  {sortColumns[3].sorted ?
                                (sortColumns[3].asc ? '▲' : '▼')
                                : ""
                                }
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((driver, i) => {
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