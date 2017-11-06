import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import fetchMock from 'fetch-mock';
import { xmlTestString } from '../testConstants';

describe('App', () => {

  const mockResponse = { body: xmlTestString};    
  fetchMock.get('https://standrewsiih.github.io/lectures.xml', mockResponse);

  describe('when the XML feed loads successfully', () => {
    let app = shallow(<App/>);
    
    app.setState({
      loading: false,
      error: false
    })

    it('should render properly', () => {      
      expect(app).toMatchSnapshot();
    });

    it('should display a List component', () => {
      expect(app.find('List').exists()).toBe(true);
    });

  });

  describe('when loading the XML feed fails', () => {
    let app = shallow(<App/>);
    
    app.setState({ 
      error: true, 
      loading: false
    });

    it('should display an error message', () => {
      expect(app.find('p').text()).toBe("Could not load podcast feed. Please try refreshing this page.");
    });

  });

});