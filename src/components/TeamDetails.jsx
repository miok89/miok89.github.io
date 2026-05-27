import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import Loader from "./Loader";
import axios from "axios";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { getFlagByNationality } from "../helper/getFlag";
import Flag from "react-flagkit";
import { getColorByPosition } from "../helper/getColor";
import BasicBreadcrumbs from "./BasicBreadcrumbs";

export default function TeamDetails(props) {
    const [teamDetails, setTeamDetails] = useState(null);
    const [teamRaces, setTeamRaces] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firstDriver, setFirstDriver] = useState("");
    const [secondDriver, setSecondDriver] = useState("");
    const [isError, setIsError] = useState(false);
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
    }, [teamRaces, props.search]);

    const params = useParams();
    console.log("team det params ", params);

    const getTeams = async () => {
        console.log("getTeams");
        setIsError(false);
        try {
            const teamStandingUrl = `https://api.jolpi.ca/ergast/f1/${props.year}/constructors/${params.id}/constructorStandings.json`;

            const teamRacesUrl = `https://api.jolpi.ca/ergast/f1/${props.year}/constructors/${params.id}/results.json`;

            const teamStandingResponse = await axios.get(teamStandingUrl);

            const teamRacesResponse = await axios.get(teamRacesUrl);

            //console.log("teamStandingResponse ", teamStandingResponse);

            console.log("teamDetails ", teamStandingResponse.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0]);

            setTeamDetails(teamStandingResponse.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0]);


            //console.log("teamRacesResponse ", teamRacesResponse);

            console.log("teamRaces ", teamRacesResponse.data.MRData.RaceTable.Races);


            setTeamRaces(teamRacesResponse.data.MRData.RaceTable.Races);

            //table races header
            setFirstDriver(teamRacesResponse.data.MRData.RaceTable.Races[0].Results[0].Driver.familyName);
            setSecondDriver(teamRacesResponse.data.MRData.RaceTable.Races[0].Results[1].Driver.familyName);
            //console.log("firstDriver ",firstDriver, " secondDriver ",secondDriver);

            setLoading(false);
        } catch (e) {
            console.error("error ", e);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    }


    const getFilteredData = () => {
        if (teamRaces != null) {
            const result = teamRaces.filter((item) => item.raceName.toLowerCase().includes(props.search.toLowerCase()));
            setFilteredData(result);
        }
    }


    if (loading) {
        return <Loader />
    }

    const crumbs = [
        { label: "Teams", path: "/teams" },
        { label: `${teamDetails.Constructor.name}`, path: "" }
    ];

    if (isError || (filteredData === null)) {
        return (
            <div className="wrapper">

                <div className="dd-col2">
                    <div className="details">
                        <BasicBreadcrumbs crumbs={crumbs} />
                        <div style={{ display: "flex" }}>
                            <img src={`../public/img/${teamDetails.Constructor.constructorId}.png`}
                                alt={teamDetails.Constructor.name}
                                style={{ width: 150 }} />
                            <div style={{ padding: "5px", textAlign: "left" }}>
                                <Flag country={getFlagByNationality(props.flags, teamDetails.Constructor.nationality)}
                                    size={30} />
                                <b><p>{teamDetails.Constructor.name}</p></b>
                            </div>
                        </div>
                        <p>Country: {teamDetails.Constructor.nationality}</p>
                        <p>History: <a href={teamDetails.Constructor.url} target="_blank"><OpenInNewIcon />
                        </a></p>
                    </div>

                    <div className="results">
                        <div className="no-data-div">
                            <img src="../img/emoji-faces-sad-emoji.png" alt="sad-emoji" />
                        </div>
                    </div>

                </div>
            </div >

        );
    }


    return (
        <div className="wrapper">

            <div className="dd-col2">
                <div className="details">
                    <BasicBreadcrumbs crumbs={crumbs} />
                    <div style={{ display: "flex" }}>
                        <img src={`../public/img/${teamDetails.Constructor.constructorId}.png`}
                            alt={teamDetails.Constructor.name}
                            style={{ width: 150 }} />
                        <div style={{ padding: "5px", textAlign: "left" }}>
                            <Flag country={getFlagByNationality(props.flags, teamDetails.Constructor.nationality)}
                                size={30} />
                            <b><p>{teamDetails.Constructor.name}</p></b>
                        </div>
                    </div>
                    <p>Country: {teamDetails.Constructor.nationality}</p>
                    <p>Points: {teamDetails.points}</p>
                    <p>History: <a href={teamDetails.Constructor.url} target="_blank"><OpenInNewIcon />
                    </a></p>
                </div>

                <div className="results">
                    <h2>Formula 1 - {props.year} Results</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Round</th>
                                <th>Grand Prix</th>
                                <th>{firstDriver}</th>
                                <th>{secondDriver}</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((race) => {
                                return (
                                    <tr key={race.round}>
                                        <td>{race.round}</td>
                                        <td>
                                            <div className="flag">
                                                <Flag country={getFlagByNationality(props.flags, "",
                                                    race.Circuit.Location.country)}
                                                    size={30} />{race.raceName}
                                            </div>
                                        </td>
                                        <td style={{ backgroundColor: getColorByPosition(race.Results[0].position) }}
                                        >{race.Results[0].position}</td>
                                        <td style={{ backgroundColor: getColorByPosition(race.Results[1].position) }}
                                        >{race.Results[1].position}</td>
                                        <td>{Number(race.Results[0].points) + Number(race.Results[1].points)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}