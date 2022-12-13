import update from "immutability-helper";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDrop } from "react-dnd";
import { FlowContext } from "../context/FlowContext.js";
import useDraft from "../utils/useDraft.js";
import { Card } from "./Card.js";
import { ItemTypes } from "./ItemTypes.js";

const style = {
  width: "100%",
};

export const Container = memo(function Container() {
  const [cards, setCards] = useState([]);
  const { draft, dirty, changed, updateDraft, resetDraft } = useDraft(cards);
  const { currNode, nodes } = useContext(FlowContext);

  useEffect(() => {
    resetDraft();
    let arr = [];
    for (let i = 0; i < currNode.children.length; i++) {
      if (nodes[currNode.children[i]].type !== "empty")
        arr.push(nodes[currNode.children[i]].data);
    }
    setCards(arr);
  }, [nodes, currNode, resetDraft]);

  const findCard = useCallback(
    (id) => {
      const card = cards.filter((c) => `${c.id}` === id)[0];
      return {
        card,
        index: cards.indexOf(card),
      };
    },
    [cards]
  );
  const moveCard = useCallback(
    (id, atIndex) => {
      const { card, index } = findCard(id);
      setCards(
        update(cards, {
          $splice: [
            [index, 1],
            [atIndex, 0, card],
          ],
        })
      );
      updateDraft(
        update(cards, {
          $splice: [
            [index, 1],
            [atIndex, 0, card],
          ],
        })
      );
    },
    [findCard, cards, setCards, updateDraft]
  );

  const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }));
  return (
    <>
      <div ref={drop} style={style}>
        {cards.map((card, i) => (
          <Card
            key={card.id}
            id={`${card.id}`}
            text={`Press ${i + 1}: ${card.label}`}
            moveCard={moveCard}
            findCard={findCard}
          />
        ))}
      </div>
      {cards.length > 1 && <Button disabled={!dirty}>Save order</Button>}
    </>
  );
});
