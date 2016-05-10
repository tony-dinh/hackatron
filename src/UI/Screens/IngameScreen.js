window.IngameState = {
    show: true,
    showOthers: false,
    currentCharacter: 'tron',
    allCharacters: ['tron', 'ghost', 'frosty', 'one'],
};

window.IngameScreen = React.createClass({
    getInitialState: function() {
        window.UI_IngameController = this;
        return window.IngameState;
    },
    _clickCharacter: function() {
        this.setState({showOthers: !this.state.showOthers});
    },
    _changeCharacter: function(key) {
        this.setState({currentCharacter: key});
        Hackatron.game.player.character.changeSkin(key);
    },
    render: function() {
        var otherElements = null;

        if (!this.state.show) {
            return <div></div>;
        }

        if (this.state.showOthers) {
            var otherCharacters = this.state.allCharacters.slice(0);
            var index = otherCharacters.indexOf(this.state.currentCharacter);
            otherCharacters.splice(index, 1);

            otherElements = <div style={styles.otherCharacterChooser}>
                {otherCharacters.map((key) => {
                    return <div style={{width: 32, height: 32, marginBottom: 10, background: 'transparent url(assets/gfx/characters/' + key + '/walkDown-0002.png) no-repeat 0 0'}} onClick={()=>this._changeCharacter(key)}></div>;
                })}
            </div>
        }

        var players = [];

        players.push({name: Hackatron.game.player.name, points: Hackatron.game.player.points});
        for (var id in Hackatron.game.players) {
            var player = Hackatron.game.players[id];
            players.push({name: player.name, points: '?'});
        }

        return (
            <div>
                <div style={styles.characterChooser}>
                    <div style={{width: 32, height: 32, background: '#01242C url(assets/gfx/characters/' + this.state.currentCharacter + '/walkDown-0002.png) no-repeat 0 0'}} onClick={this._clickCharacter}></div>
                    {this.state.showOthers && otherElements}
                </div>
                <div style={styles.scoreboard}>
                    {players.map(function(item) {
                      return <div>{item.name}: {item.points}</div>;
                    })}
                </div>
            </div>
        );
    }
});

var styles = {
    scoreboard: {
        position: 'absolute',
        top: 20,
        left: 450,
        width: 200,
        height: 100,
        padding: 5,
        opacity: 0.8,
        'box-shadow': '2px 1px #000',
        background: '#00191F',
        border: '3px solid #1583C8',
        color: '#fff',
        fontFamily: 'Helvetica, sans-serif'
    },
    characterChooser: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 50,
        padding: 5,
        opacity: 0.8,
        'box-shadow': '2px 1px #000',
        background: '#00191F',
        border: '3px solid #1583C8',
        color: '#fff',
        fontFamily: 'Helvetica, sans-serif'
    },
    otherCharacterChooser: {
        color: '#fff',
        padding: '15px 0 0 5px',
        fontFamily: 'Helvetica, sans-serif'
    }
};
