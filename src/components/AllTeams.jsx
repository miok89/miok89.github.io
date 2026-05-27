import { useState, useEffect } from "react";
import Loader from "./Loader";
import axios from "axios";
import { useNavigate } from "react-router";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { getFlagByNationality } from "../helper/getFlag";
import Flag from "react-flagkit";
import BasicBreadcrumbs from "./BasicBreadcrumbs";

export default function AllTeams(props) {
    const [teams, setTeams] = useState([]);
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
        getTeams();
    }, [props.year]);

    useEffect(() => {
        getFilteredData();
    }, [teams, props.search]);

    const getTeams = async () => {
        const url = `https://api.jolpi.ca/ergast/f1/${props.year}/constructorStandings.json`;
        const response = await axios.get(url);
        //console.log("response", response);
        console.log("teams", response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings);

        setTeams(response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings);
        setLoading(false);
    };


    const getFilteredData = () => {
        console.log("getFilteredData");
        let result = teams;
        //console.log("getFilteredData result ", result);
        result = result.filter((item) =>
            item.Constructor.name.toLowerCase().includes(props.search.toLowerCase())
        );

        setFilteredData(result);
    }


    const handleClick = (id) => {
        console.log("id ", id);
        navigate(`/teamDetails/${id}`);
    }

    if (loading) {
        return <Loader />;
    }

    const crumbs = [
        { label: "Teams", path: "/teams" }
    ];


    return (
        <div className="wrapper">

            <div className="col2" className="results">
                <BasicBreadcrumbs crumbs={crumbs} />
                <h2>CONSTRUCTORS CHAMPIONSHIP - {props.year}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Team</th>
                            <th>Details</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((team, i) => {
                            return (
                                <tr key={i}>
                                    {/* <td>{team.position}</td> ne postoji u starim godinama */}
                                    <td>{i + 1}</td>
                                    <td onClick={() => handleClick(team.Constructor.constructorId)}>
                                        <div className="link">
                                            <Flag country={getFlagByNationality(props.flags,
                                                team.Constructor.nationality)}
                                                size={30} />{team.Constructor.name}
                                        </div>
                                    </td>
                                    <td>Details
                                        <a href={team.Constructor.url} target="_blank"><OpenInNewIcon /></a>
                                    </td>
                                    <td>{team.points}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

