import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AcuityStaircase, Direction, ThresholdScreen } from '../engine/staircase';
import { letterHeightPx } from '../engine/logmar';
import { TumblingE } from './TumblingE';
import { SwipePad } from './SwipePad';
import { colors, type } from './theme';

/**
 * Shared UI that drives either test engine: renders the current optotype at
 * its calibrated physical size and feeds responses back until finished.
 */

interface CommonProps {
  distanceMm: number;
  pxPerMm: number;
  headline: string;
}

export function ThresholdRunner({
  distanceMm,
  pxPerMm,
  headline,
  onDone,
}: CommonProps & { onDone: (good: boolean) => void }) {
  const test = useMemo(() => new ThresholdScreen(), []);
  const [, force] = useState(0);

  const answer = (d: Direction) => {
    test.respond(d);
    if (test.finished) onDone(test.result);
    else force((n) => n + 1);
  };

  return (
    <Stage
      headline={headline}
      practice={test.current.practice}
      sizePx={letterHeightPx(test.current.level, distanceMm, pxPerMm)}
      direction={test.current.direction}
      onAnswer={answer}
    />
  );
}

export function StaircaseRunner({
  distanceMm,
  pxPerMm,
  headline,
  onDone,
}: CommonProps & { onDone: (logmar: number | null) => void }) {
  const test = useMemo(() => new AcuityStaircase(), []);
  const [, force] = useState(0);

  const answer = (d: Direction) => {
    test.respond(d);
    if (test.finished) onDone(test.resultLogmar);
    else force((n) => n + 1);
  };

  return (
    <Stage
      headline={headline}
      practice={false}
      sizePx={letterHeightPx(test.current.level, distanceMm, pxPerMm)}
      direction={test.current.direction}
      onAnswer={answer}
    />
  );
}

function Stage({
  headline,
  practice,
  sizePx,
  direction,
  onAnswer,
}: {
  headline: string;
  practice: boolean;
  sizePx: number;
  direction: Direction;
  onAnswer: (d: Direction) => void;
}) {
  return (
    <View style={styles.stage}>
      <Text style={type.label}>{headline}</Text>
      {practice && <Text style={styles.practice}>Practice — not scored</Text>}
      <View style={styles.optotypeArea}>
        <TumblingE sizePx={sizePx} direction={direction} />
      </View>
      <SwipePad onAnswer={onAnswer} />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, padding: 20, backgroundColor: colors.bg },
  practice: { color: colors.amber, fontWeight: '700', marginTop: 6 },
  optotypeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
