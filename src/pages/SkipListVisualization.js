import './SkipListVisualization.css'

function SkipListVisualization({ list }) {
    const allNodes = [];
    let current = list.header.forward[0];
    while (current) {
        allNodes.push(current.value);
        current = current.forward[0];
    }

    return (
        <div className="skip-list-container">
            {Array.from({ length: list.level + 1 }, (_, level) => list.level - level)
                .map(level => (
                    <div key={level} className="level-container">
                        <span>Уровень {level}</span>
                        <div className="nodes-container">
                            {allNodes.map(value => renderNode(list, level, value))}
                        </div>
                    </div>
                )).reverse()}
        </div>
    );
}

function renderNode(list, level, value) {
    let current = list.header;
    let isVisible = false;

    for (let i = list.level; i >= level; i--) {
        while (current.forward[i] && current.forward[i].value < value) {
            current = current.forward[i];
        }
        if (current.forward[i] && current.forward[i].value === value) {
            isVisible = true;
        }
    }

    return isVisible ? (
        <div key={value} className="node">{value}</div>
    ) : (
        <div key={value + "-placeholder"} className="node-placeholder"></div>
    );
}


export default SkipListVisualization;