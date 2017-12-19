import React, { Component } from 'react';
import {accessId, APIkey} from './secrets.js'
import './App.css';

class App extends Component {

  state = {
    forecast: [],
    fahrenheit: true,
    zip: 11101
  }

  fetchWeather = () => {
    return fetch(`http://api.aerisapi.com/forecasts/${this.state.zip}?client_id=${accessId}&client_secret=${APIkey}`)
    .then((res) => res.json())
  }

  componentDidMount = () => {
    this.fetchWeather()
    .then((json) => {
        this.setState({ forecast: json.response[0].periods })
      })
  }

  formatDate = (date) => {
    return new Date(date)
  }

  importAll = (r) => {
    let icons = {};
    r.keys().map((item, index) => { icons[item.replace('./', '')] = r(item); });
    return icons;
  }

  toggleUnit = () => {
    this.setState({
      fahrenheit: !this.state.fahrenheit
    })
  }

  searchZipCode = (e) => {
    e.preventDefault()
    this.fetchWeather()
    .then((json) => {
        this.setState({ forecast: json.response[0].periods })
      })
  }

  handleChange = (e) => {
    this.setState({
      zip: e.target.value
    })
  }


  render() {
    const icons = this.importAll(require.context('./icons', false, /\.(png|jpe?g|svg)$/));

    return (
      <div className="App">
        <h1>7-Day Forecast for</h1>
        <form onSubmit={this.searchZipCode}>
          <label type='text'>
            Zip code: <input placeholder='11101' name='code' value={this.state.zip} onChange={this.handleChange}/>
          </label>
          <input type="submit" value="Get Weather" className='button'/>
        </form>
        <button onClick={this.toggleUnit}> {this.state.fahrenheit ? `Show ˚C` : `Show ˚F`}</button>

          <div className='forecast'>
            { this.state.forecast.map( forecast =>
              <div key={forecast.dateTimeISO} className='daily'>
                <h3>{this.formatDate(forecast.dateTimeISO).getMonth()+1}-{this.formatDate(forecast.dateTimeISO).getDate()}-{this.formatDate(forecast.dateTimeISO).getFullYear()}</h3>
                <img src={icons[forecast.icon]} alt='Not found'/>
                <p>High: {this.state.fahrenheit ? `${forecast.maxTempF}˚F` : `${forecast.maxTempC}˚C`}</p>
                <p>Low: {this.state.fahrenheit ? `${forecast.minTempF}˚F` : `${forecast.minTempC}˚C`}</p>
              </div>
            )}

          </div>
      </div>
    );
  }
}

export default App;
