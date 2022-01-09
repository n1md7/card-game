import React from 'react';

type Props = {
  roundResults: null | Object[];
  gameResults: null | Object[];
  style?: Object;
};

export default function (props: Props) {
  return props.roundResults && !!props.roundResults.length ? (
    <table className="table-sm table-bordered table-dark" style={props.style}>
      <colgroup>
        <col />
        <col />
        <col />
        <col />
        <col />
        <col style={{ background: 'rgba(152,48,48,0.53)' }} />
      </colgroup>
      <thead>
        <tr>
          <th>Player</th>
          <th>♣️-TWO</th>
          <th>♦️-TEN</th>
          <th>Clubs</th>
          <th>Cards</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {props.roundResults.map((round: any, idx) => (
          <>
            <tr className="text-center" key={`r-${idx}`}>
              <td colSpan={6}>Round {idx + 1}</td>
            </tr>
            {round &&
              round.map((player: any, pid: number) => (
                <tr className="text-center" key={`s-${pid}-${idx}`}>
                  <td valign={'middle'}>{player.name}</td>
                  <td valign={'middle'}>{player.result.hasTwoOfClubs ? '1' : '0'}</td>
                  <td valign={'middle'}>{player.result.hasTenOfDiamonds ? '1' : '0'}</td>
                  <td valign={'middle'}>{player.result.numberOfClubs}</td>
                  <td valign={'middle'}>{player.result.numberOfCards}</td>
                  <td valign={'middle'}>{player.score}</td>
                </tr>
              ))}
          </>
        ))}
        {props.gameResults && !!props.gameResults.length && (
          <>
            <tr className="text-center" key={'hmm'}>
              <td colSpan={6}>Summary</td>
            </tr>
            {props.gameResults.map((player: any, idx) => (
              <>
                <tr className="text-center" key={`h-${idx}`}>
                  <td colSpan={1}>{player.name}</td>
                  <td colSpan={4}>{player.isWinner ? 'Winner' : ''}</td>
                  <td colSpan={1}>{player.score}</td>
                </tr>
              </>
            ))}
          </>
        )}
      </tbody>
    </table>
  ) : (
    <div className="text-center">
      <h3>No results</h3>
    </div>
  );
}
