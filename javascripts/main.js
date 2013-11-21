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

  var Event = function(type) {
    this.races = [];
    this.type = type;
    this.racers = _.shuffle(boys);
    this.$el = $();
  };

  Event.prototype = {
    addRace: function() {
      var race = new Race(event.type);
      this.races.push(race);
      race.$el = $(raceTemplate({ race: race }));
      race.$el.appendTo('.races', this.$el);
      this.selectRacers();
    },
    selectRacers: function() {
      var teams = [[], []],
          teamSize = Math.round(this.racers.length / 2),
          racers = this.racers;
      _.each(teams, function(team) {
        while (team.length < teamSize && racers.length) {
          team.push(racers.splice(0,1)[0]);
        }
      });
      console.log(teams);
    }
  }

  var Race = function(type) {
    this.type = type;
    this.racers = [];
    this.$el = $();
  }

  var $controls = $('#controls'),
      $type = $(':radio', $controls),
      $eventArea = $('#event');

  var eventTemplate = _.template($('#event-template').html()),
      raceTemplate = _.template($('#race-template').html());

  function setup() {
    $controls.on('click', 'button', function(e) {
      e.preventDefault();
      switch(e.target.id) {
        case 'new-event':
          addEvent();
          break;
      }
    });
    $eventArea.on('click', 'button', addRace);
  }

  function addEvent() {
    var e = new Event($type.filter(':checked').val());
    events.push(e);
    e.$el = $(eventTemplate({ event: e }));
    $eventArea.html(e.$el);
  }

  function addRace() {
    events[events.length - 1].addRace();
  }

  window.Rally = {
    setup: setup
  };

})();