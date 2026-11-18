package org.vixir.school;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashSet;
import java.util.SplittableRandom;
import net.jqwik.api.ForAll;
import net.jqwik.api.Property;
import net.jqwik.api.constraints.AlphaChars;
import net.jqwik.api.constraints.StringLength;

class JoinCodeGeneratorProperties {

    @Property
    void codesHaveTheDocumentedShapeAndNoAmbiguousCharacters(
            @ForAll @AlphaChars @StringLength(min = 1, max = 12) String subject,
            @ForAll("levels") String level,
            @ForAll long seed) {
        var code = new JoinCodeGenerator(new SplittableRandom(seed)).next(subject, level);
        assertThat(code).matches("[A-Z]{3}-[A-Z0-9]+-[" + JoinCodeGenerator.ALPHABET + "]{4}");
        assertThat(code.substring(code.length() - 4)).doesNotContainAnyWhitespaces().doesNotContain("0", "O", "1", "I", "L");
    }

    @net.jqwik.api.Provide
    net.jqwik.api.Arbitrary<String> levels() {
        return net.jqwik.api.Arbitraries.of("SS1", "SS2", "SS3", "ND", "HND", "100L", "200L");
    }

    @Property(tries = 5)
    void tenThousandCodesAreAlmostAlwaysUnique(@ForAll long seed) {
        var gen = new JoinCodeGenerator(new SplittableRandom(seed));
        var seen = new HashSet<String>();
        for (int i = 0; i < 10_000; i++) seen.add(gen.next("Physics", "SS3"));
        // 31^4 ≈ 923k codes per prefix; the service retries on a DB unique-violation for the rare clash.
        assertThat(seen.size()).isGreaterThan(9_900);
    }
}
