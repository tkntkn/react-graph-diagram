import React from 'react';

export const End = class extends React.Component {
    componentDidMount  () { this.updateEdges(); }
    componentDidUpdate () { this.updateEdges(); }

    updateEdges () {
        if (!this.props.__updateEdges__) new Error('Please pass "this.makeEndProps()" result to End element in Graph class.');
        this.props.__updateEdges__(this.getEndPosition());
    }

    getEndPosition () { throw new Error('Please implement "getEndPosition" method of End class.'); }
}

export const Edge = class extends React.Component {
    constructor (props) {
        super(props);
        this.ends = new Proxy({src: {x:0, y:0}, dst: {x:0, y:0}}, {
            set: (target, prop, value, receiver) => { target[prop] = value; this.forceUpdate(); return true; }
        });
    }
}

const check = o => [console.log(o), o][1]

export const Graph = class extends React.Component {
    makeEndProps (end) {
        return { __updateEdges__: this.updateEdgesOf(end) };
    }

    updateEdgesOf (end) {
        const src = this.edges.filter(edge => edge.ends.src.id === end.id)
        const dst = this.edges.filter(edge => edge.ends.dst.id === end.id)
        return position => {
            try {
                src.forEach(edge => { Object.assign(this.refs[edge.id].ends, {src: position}); });
                dst.forEach(edge => { Object.assign(this.refs[edge.id].ends, {dst: position}); });
            } catch (e) {
                if (!(e instanceof TypeError)) throw e;
                throw new Error('Please inherit constructor in Edge class.')
            }
        };
    }
};
