(function() {

  var boys = [
        'Miles',
        'Noah',
        'Elliot',
        'Eben',
        'Isaiah',
        'Tobey',
        'Caleb'
      ],
      events = [],
      races = [];

  var $controls = $('#controls'),
      $type = $(':radio', $controls),
      $eventArea = $('#event');

  var Event = function(type) {
    this.races = [];
    this.type = type;
    this.racers = _.shuffle(boys);
    this.$el = $();
    this.teamSize = (type == 'duel') ? 1 : Math.round(this.racers.length / 2);
    events.push(this);
    this.render();
  };

  Event.prototype = {
    render: function() {
      this.$el = $(eventTemplate({ event: this }));
      $eventArea.append(this.$el);
    },
    addRace: function(teams, winner) {
      var race = new Race(this.type, teams || this.selectRacers(), winner);
      this.races.push(race);
      $('.races', this.$el).append(race.render());
      store();
    },
    selectRacers: function() {
      var teams = [[], []],
          teamSize = this.teamSize;
      _.each(teams, function(team, i) {
        if (!this.racers.length) {
          var racers = _.shuffle(boys);
          this.racers = (i === 0) ? racers : _.difference(racers, team[0]);
        }
        while (team.length < teamSize && this.racers.length) {
          team.push(this.racers.splice(0, 1)[0]);
        }
      }, this);
      return teams;
    }
  };

  var Race = function(type, teams, winner) {
    this.type = type;
    this.teams = teams;
    this.$el = $();
    this.winner = winner;
  };

  Race.prototype = {
    render: function() {
      var rendered = $(raceTemplate({ race: this }));
      if (this.$el) {
        this.$el.replaceWith(rendered);
      }
      this.$el = rendered;
      this.$el.bind('click', 'button.result', _.bind(this.markWinner, this));
      return this.$el;
    },
    markWinner: function(e) {
      this.$el.find('button').removeClass('winner')
      $(e.target).addClass('winner');
      this.winner = $(e.target).data('team');
      store();
    }
  }

  var eventTemplate = _.template($('#event-template').html()),
      raceTemplate = _.template($('#race-template').html());

  

  function addEvent() {
    var e = new Event($type.filter(':checked').val());
    store();
    e.addRace();
  }

  function store() {
    localStorage.boys = JSON.stringify(boys);
    localStorage.events = JSON.stringify(_.map(events, function(event) {
      return {
        type: event.type,
        races: _.map(event.races, function(race) {
          return { type: race.type, teams: race.teams, winner: race.winner };
        })}
    }));
  }

  function addRacer() {
    var $name = $(':text[name=new-racer-name]'),
        name = $name.val();
    if (name) {
      boys.push(name);
      $name.val('');
    }
  }

  function addRace() {
    events[events.length - 1].addRace();
  }

  function setup() {
    if (localStorage.boys) {
      console.log('restore boys', localStorage.boys);
      boys = JSON.parse(localStorage.boys);
    }
    if (localStorage.events) {
      console.log(localStorage.events);
      _.each(JSON.parse(localStorage.events), function(event) {
        var e = new Event(event.type);
        _.each(event.races, function(race) {
          e.addRace(race.teams, race.winner);
        })
      })
    }
    $controls.on('click', 'button', function(e) {
      e.preventDefault();
      switch(e.target.id) {
        case 'new-event':
          addEvent();
          break;
        case 'new-racer':
          addRacer();
          break;
        case 'reset':
          if (confirm('Really?')) {
            localStorage.removeItem('events');
            localStorage.removeItem('boys');
            location.href = location.href;
          }
          break;
      }
    });
    $eventArea.on('click', '#new-race', addRace);
  }

  window.Rally = {
    setup: setup
  };

})();