const pointer = event => ({x:event.clientX, y:event.clientY});
const vecaddsub = (a,b,c) => ({x:a.x+b.x-c.x, y:a.y+b.y-c.y});
const dummyImage = document.createElement('img');
dummyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const defaultOptions = {
    propsToPosition: props => ({x:0, y:0}),
    preservePosition: false,
}

export const Movable = (ReactComponent, options={}) => {
    options = Object.assign({}, defaultOptions, options);

    const onMoveStart = function (event) {
        event.dataTransfer.setDragImage(dummyImage, 0, 0);
        this.updatePosition(pointer(event), true);
    }

    const onMove = function (event) {
        this.updatePosition(pointer(event), true, true);
    }

    const onMoveFinish = function (event) {
        this.updatePosition(pointer(event), false);
    }

    return class extends ReactComponent {
        constructor (props) {
            super(props);
            this.position = options.propsToPosition(props);
            this.prevPosition = null;
            this.moving = false;
            this.moveHandlers = {
                onMoveStart: onMoveStart.bind(this),
                onMove: onMove.bind(this),
                onMoveFinish: onMoveFinish.bind(this)
            };
        }

        componentWillReceiveProps (nextProps) {
            if (super.componentWillReceiveProps) super.componentWillReceiveProps(nextProps);
            if (!options.preservePosition) {
                this.position = options.propsToPosition(nextProps);
            }
        }

        updatePosition (position, moving, bugCut) {
            if (bugCut && position.x === 0 && position.y === 0) return;
            if (this.moving && this.prevPosition) {
                this.position = vecaddsub(this.position, position, this.prevPosition);
                this.forceUpdate();
            }
            this.prevPosition = position;
            this.moving = moving;
        }
    }
}
