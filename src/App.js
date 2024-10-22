import React, {Component} from "react";
import "./App.css";
import * as d3 from "d3"

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {wordFrequency: []};
    }

    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate() {
        this.renderChart();
    }

    getWordFrequency = (text) => {
        const stopWords = new Set(["the", "and", "a", "an", "in", "on", "at", "for", "with", "about", "as", "by", "to", "of", "from", "that", "which", "who", "whom", "this", "these", "those", "it", "its", "they", "their", "them", "we", "our", "ours", "you", "your", "yours", "he", "him", "his", "she", "her", "hers", "it", "its", "we", "us", "our", "ours", "they", "them", "theirs", "I", "me", "my", "myself", "you", "your", "yourself", "yourselves", "was", "were", "is", "am", "are", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "as", "if", "each", "how", "which", "who", "whom", "what", "this", "these", "those", "that", "with", "without", "through", "over", "under", "above", "below", "between", "among", "during", "before", "after", "until", "while", "of", "for", "on", "off", "out", "in", "into", "by", "about", "against", "with", "amongst", "throughout", "despite", "towards", "upon", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "hadn't", "doesn't", "didn't", "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't", "shouldn't", "mustn't", "needn't", "daren't", "hasn't", "haven't", "hadn't"]);
        const words = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=_`~()]/g, "").replace(/\s{2,}/g, " ").split(" ");
        const filteredWords = words.filter(word => !stopWords.has(word));
        return Object.entries(filteredWords.reduce((freq, word) => {
            freq[word] = (freq[word] || 0) + 1;
            return freq;
        }, {}));
    }


    renderChart() {
        const data = this.state.wordFrequency.sort((a, b) => b[1] - a[1]).slice(0, 5)
        console.log(data)
        // your code here

        // done to clean up the text data to get the lone words.
        let dataset = [];
        for (let i in data) {
            dataset.push(data[i][0])
        }
        console.log(dataset);

        // width and height vars
        let width = 1000;
        let height = 300;
        let padding = 20;

        // svg canvas where word cloud will be placed onto
        let svg_cloud = d3.select(".svg_parent")
            .attr("width", width)
            .attr("height", height)


        // d3.scaleLinear() for the x position scale
        let position_scale = d3.scaleLinear()
            .domain([0, dataset.length])
            .range([0, width]);

        // d3.scaleLinear() for the font position scale
        let font_scale = d3.scaleLinear()
            .domain([dataset.length, 0])
            .range([0, 50])

        // text object which will take in the new data every time the button is clicked
        let text = svg_cloud.selectAll("text")
            .data(dataset, function (d) {
                return d;
            })

        // 1st initial button press
        text.enter()
            .append("text")
            .attr("x", function (d, i) {
                return position_scale(i) + padding;
            })
            .attr("y", 150)
            .attr("color", "black")
            .attr("font-family", "times new roman")
            .transition()
            .duration(2000)
            .ease(d3.easeCubicInOut)
            .text(function (d) {
                return d;
            })
            .attr("font-size", function (d, i) {
                return font_scale(i);
            })


        // when the "Generate WordCloud" button after the initial press, we update it with new animation here and
        // change the positions and font size
        text.attr("y", 150)
            .text(function (d) {
                return d;
            })
            .transition()
            .duration(2000)
            .ease(d3.easeCubicInOut)
            .attr("x", function (d, i) {
                return position_scale(i) + padding;
            })
            .attr("font-size", function (d, i) {
                return font_scale(i);
            })

        // removes any text data that does not match the data given as input into the d3 text object.
        text.exit().remove()
    }

    render() {
        return (
            <div className="parent">
                <div className="child1" style={{width: 1000}}>
                    <textarea type="text" id="input_field" style={{height: 150, width: 1000}}/>
                    <button type="submit" value="Generate Matrix" style={{marginTop: 10, height: 40, width: 1000}}
                            onClick={() => {
                                var input_data = document.getElementById("input_field").value
                                this.setState({wordFrequency: this.getWordFrequency(input_data)})
                            }}
                    > Generate WordCloud
                    </button>
                </div>
                <div className="child2">
                    <svg className="svg_parent"></svg>
                </div>
            </div>
        );
    }
}

export default App;
