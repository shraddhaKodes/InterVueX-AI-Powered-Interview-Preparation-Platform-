import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ChallengeEditor from "../../components/challenge/ChallengeEditor";
import { useCodingArenaStore } from "../../store/codingArenaStore";

const ChallengeEditorPage = () => {
  const { problemId } = useParams();
  const { fetchProblem } = useCodingArenaStore();

  useEffect(() => {
    if (problemId) fetchProblem(problemId);
  }, [problemId]);

  return <ChallengeEditor problemId={problemId} />;
};

export default ChallengeEditorPage;
