import { useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useApi } from "../../hooks/useApi";

import TextInput from "../TextInput/TextInput";

export default function EventForm() {

    const api = useApi();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [artist, setArtist] = useState('');
    const [venue, setVenue] = useState('');
    const [url, setUrl] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [code, setCode] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState(false);

    const createEvent = async (e: FormEvent) => {
        e.preventDefault();

        const [result, body] = await api.post('events/add', {
            name,
            artist,
            venue,
            date: new Date(`${date}T${time}`),
            location: {
                address,
                city,
                state,
                code
            },
            url: url
        });

        if (result.ok) {
            navigate(`/event-finder/event/${body.event._id}`);
        }

        setError(true);
    }

    return (
        <>
            <form onSubmit={createEvent}>
                <div className="row">
                    <div className="col-6">
                        <h5>Info</h5>
                        <TextInput
                            value={name} label="Name" placeholder=" " type="text"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        />
                        <TextInput
                            value={artist} label="Artist" placeholder=" " type="text"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setArtist(e.target.value)}
                        />
                        <TextInput
                            value={venue} label="Venue" placeholder=" " type="text"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setVenue(e.target.value)}
                        />
                        <TextInput
                            value={url} label="URL" placeholder=" " type="text"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                        />
                    </div>
                    <div className="col-6">
                        <h5>Location</h5>
                        <TextInput
                            value={address} label="Address" placeholder=" " type="text"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                        />
                        <TextInput
                            value={city} label="City" placeholder=" " type="text"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
                        />
                        <TextInput
                            value={state} label="State" placeholder=" " type="text"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setState(e.target.value)}
                        />
                        <TextInput
                            value={code} label="Code" placeholder=" " type="text"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
                        />
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <input className="date-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} pattern="\d{4}-\d{2}-\d{2}" required/>
                        </div>
                        <div className="col-6">
                            <input className="time-input" type="time" value={time} onChange={(e) => setTime(e.target.value)} required/>
                        </div>
                    </div>
                </div>

                {error && <p className="form-error">Please Fill Out Each Field Appropriately</p>}

                <button type="submit">Publish</button>
            </form>
        </>
    );
}