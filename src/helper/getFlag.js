export function getFlagByNationality(flags, nationality, country) {
    if (nationality != "") {

        if (nationality === "British") {
            return "GB";
        } else if (nationality === "German") {
            return "DE";
        } else if (nationality === "Dutch") {
            return "NL";
        }
        const flag = flags.find((flag) => flag.nationality === nationality);
        //console.log(nationality, flag?.alpha_2_code);
        return flag?.alpha_2_code;
    }
    else //by country
    {
        if (country === "UK") {
            return "GB";
        } else if (country === "Germany") {
            return "DE";
        } else if (country === "Netherlands") {
            return "NL";
        }

        const flag = flags.find((flag) => flag.en_short_name === country);
        //console.log(country, flag?.alpha_2_code);
        return flag?.alpha_2_code;
    }
}

