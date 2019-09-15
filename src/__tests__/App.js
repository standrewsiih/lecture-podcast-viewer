import React from "react";
import { shallow } from "enzyme";
import fetchMock from "fetch-mock";

import App from "../App";

fetchMock.config.overwriteRoutes = true;
const xmlTestString =
  '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:cc="http://web.resource.org/cc/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><channel><item><title>Some title</title><pubDate>Wed, 14 Mar 2018 17:15:00 +0000</pubDate><guid isPermaLink="false"><![CDATA[7c8a5d21281af5d853eb82c25039e040]]></guid><link><![CDATA[https://traffic.libsyn.com/secure/intellectualhistory/some-file.mp3]]></link><itunes:image href="https://ssl-static.libsyn.com/p/assets/d/1/a/6/d1a6492871c6083a/podcast.jpg" /><description><![CDATA[Description in CDATA field.]]></description><content:encoded><![CDATA[Longer description in CDATA field.]]></content:encoded><enclosure length="44961570" type="audio/mpeg" url="https://traffic.libsyn.com/secure/intellectualhistory/some-file.mp3" /><itunes:duration>47:43</itunes:duration><itunes:explicit>clean</itunes:explicit><itunes:keywords /><itunes:subtitle><![CDATA[Subtitle in CDATA field.]]></itunes:subtitle><itunes:episodeType>full</itunes:episodeType></item></channel></rss>';

describe("App", () => {
  const mockResponse = {
    body: xmlTestString
  };

  describe("when the XML feed loads successfully", () => {
    fetchMock.get("https://intellectualhistory.libsyn.com/rss", mockResponse);
    const app = shallow(<App />);

    it("should render properly", () => {
      expect(app).toMatchSnapshot();
    });

    it("should have loading state set to false", () => {
      expect(app.instance().state.loading).toBe(false);
    });

    it("should have error state set to false", () => {
      expect(app.instance().state.error).toBe(false);
    });

    it("should display a List component", () => {
      expect(app.find("List").exists()).toBe(true);
    });
  });

  describe("when loading the XML feed fails", () => {
    fetchMock.get("https://intellectualhistory.libsyn.com/rss", 404);
    const app = shallow(<App />);

    it("should have loading state set to false", () => {
      expect(app.instance().state.loading).toBe(false);
    });

    it("should have error state set to true", () => {
      expect(app.instance().state.error).toBe(true);
    });

    it("should display an error message", () => {
      expect(app.find("p").text()).toBe(
        "Could not load podcast feed. Please try refreshing this page."
      );
    });
  });
});
