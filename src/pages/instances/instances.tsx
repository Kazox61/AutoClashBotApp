import { useEffect, useState } from "react";
import Select, {MultiValue, StylesConfig} from 'react-select';
import useWebSocket, { ReadyState } from "react-use-websocket"
import "./instances.scss"


interface Profile {
    name: string;
    id: number;
}
  
interface ProfileOption {
    readonly value: string;
    readonly label: string;
}

interface WSMessage {
    type: string;
}  
  
const selectStyle: StylesConfig<ProfileOption, true> = {
    control: (provided, state) => {
        return {
            ...provided,
            backgroundColor: "transparent"
        };
    },
    menuList: (provided, state) => {
        return {
            ...provided,
            backgroundColor: "#222b3c"
        };
    },
    option: (provided, state) => {
        return {
            ...provided,
            backgroundColor: state.isFocused ? '#384256' : '#222b3c',
        };
    },
    multiValue: (provided, state) => {
        return {
            ...provided,
            backgroundColor: '#384256',
        };
    },
    multiValueLabel: (provided, state) => {
        return {
            ...provided,
            color: '#fff',
        };
    },
};


const Instances = () => {
    const [instances, setInstances] = useState([]);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [profileOptions, setProfileOptions] = useState<ProfileOption[]>([]);
    const [selectedProfiles, setSelectedProfiles] = useState<Record<number, ProfileOption[]>>({});

    const WS_URL = "ws://127.0.0.1:8000/updates"
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        WS_URL,
        {
        share: false,
        shouldReconnect: () => true,
        },
    )

    useEffect(() => {
        console.log(readyState);
    }, [readyState])

    useEffect(() => {
        if (lastJsonMessage) {
            if (lastJsonMessage.type === "addProfileToInstance") {
                addOption(lastJsonMessage.instance_number, lastJsonMessage.profile_name)
                console.log(lastJsonMessage)
            }
        }
      }, [lastJsonMessage])

    const get_instances = async () => {
        const data = await fetch("http://localhost:8000/instances", {
            method: 'GET',
            mode: 'cors'
        });
        setInstances(await data.json());
    }

    const get_profiles = async() => {
        const data = await fetch("http://localhost:8000/profiles", {
            method: 'GET',
            mode: 'cors'
        });
        const response: Profile[] = await data.json()
        setProfiles(response);
        
        const options: ProfileOption[] = response.map(profile => ({
            value: profile.name, // Convert id to string if needed
            label: profile.name
        }));
        setProfileOptions(options);
    }

    useEffect(() => {
        get_instances();
        get_profiles();
    }, [selectedProfiles]);

    const handleProfileChange = (selectedOptions: MultiValue<ProfileOption> | null, index: number) => {
        if (selectedOptions) {
            let selectedOptionsArray: ProfileOption[] = [];
            selectedOptions.forEach(element => selectedOptionsArray.push(element));

            const prevSelectedOptions = selectedProfiles[index] || [];

            const addedProfiles = selectedOptionsArray.filter(option => !prevSelectedOptions.includes(option));
            const removedProfiles = prevSelectedOptions.filter(option => !selectedOptionsArray.includes(option));

            addedProfiles.forEach(profile => {
                fetch(`http://localhost:8000/instances/${index}/profiles/${profile.value}/add`, {
                    method: 'POST'
                });
            });

            removedProfiles.forEach(profile => {
                fetch(`http://localhost:8000/instances/${index}/profiles/${profile.value}/remove`, {
                    method: 'POST'
                });
            });

            // Example: Update state for the specific index
            setSelectedProfiles(prevState => ({
            ...prevState,
            [index]: selectedOptionsArray,
            }));            
        }
    };

    const addOption = (instance_number: number, profile_name: string) => {
        const newOption:  ProfileOption = { value: profile_name, label: profile_name };
        if (selectedProfiles[0]) {
            var prevSelectedOptions = selectedProfiles[instance_number];
            let hasOptionAlready = false;
            prevSelectedOptions.forEach(option => {
                if (option.value === profile_name) {
                    hasOptionAlready = true;
                }
                option.value
            });
            if (!hasOptionAlready) {
                prevSelectedOptions.push(newOption);
            }
        }
        else {
            var prevSelectedOptions = [newOption]
        }
        
        setSelectedProfiles(prevState=> ({
                ...prevState,
                [instance_number]: prevSelectedOptions
            }));
    }

    const startInstance = (index: number) => {
        fetch(`http://localhost:8000/instance/${index}/start`);
    };

    return (
        <div className="wrapper">
            <h1>Instances</h1>
            <div className="instances">
                {
                    instances.map((instance, index) => {
                        return (
                            <div className="instance" key={instance}>
                                <div className="information">
                                    <div>
                                        <div>Index:</div>
                                        <div>Name:</div>
                                        <div>Status:</div>
                                    </div>
                                    <div>
                                        <div>0</div>
                                        <div>{instance}</div>
                                        <div>Running</div>
                                    </div>
                                </div>
                                <div className="actions">
                                    <button onClick={(_) => startInstance(index)}><img className="icon" src="./play.svg" alt=""/></button>
                                    <button><img className="icon" src="./reload.svg" alt=""/></button>
                                    <button><img className="icon" src="./shutdown.svg" alt=""/></button>
                                </div>
                                <div>
                                    <div>Active Profiles</div>
                                    <div style={{width: '20vw'}}><Select
                                        defaultValue={[]}
                                        isMulti
                                        name={String(index)}
                                        options={profileOptions}
                                        styles={selectStyle}
                                        value={selectedProfiles[index]}
                                        onChange={(selectedOption) => handleProfileChange(selectedOption, index)}
                                    /></div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Instances