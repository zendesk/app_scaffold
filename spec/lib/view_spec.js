import View from '../../lib/javascripts/view';

describe('View', () => {
  it('can be constructed without arguments', function() {
    expect(new View().constructor).toBe(View);
  });
});
